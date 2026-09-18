"""
Phishing SMS investigator.

Input:  a sender string (phone number, short code, or email) + message text.
Output: a JSON-serializable investigation report.

Flow:
  1. Classify the sender (short code / long code / email) with python-phonenumbers.
  2. Find which company (brand) the message claims to be from.
  3. Check whether that company plausibly owns the sender.
  4. Inspect URLs and content for classic smishing signals.
  5. Score offline, then (optionally) ask Claude for a final verdict + explanation.

Only external dependency for the offline path: `phonenumbers` (no account, no network).
Claude is used when ANTHROPIC_API_KEY (or an `ant auth login` profile) is available.
"""

from __future__ import annotations

import difflib
import json
import os
import re
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

import phonenumbers
from phonenumbers import carrier, geocoder, PhoneNumberType

BRANDS_PATH = Path(__file__).with_name("brands.json")
DEFAULT_REGION = "US"

# --------------------------------------------------------------------------- #
# Input adapter. When the real log format arrives, change ONLY this function.
# --------------------------------------------------------------------------- #

def normalize_incoming(raw: dict[str, Any]) -> dict[str, str]:
    """Map whatever the upstream log looks like to {sender, text, received_at, id}."""
    return {
        "id": str(raw.get("id") or raw.get("message_id") or ""),
        "sender": str(raw.get("sender") or raw.get("from") or raw.get("from_number") or "").strip(),
        "text": str(raw.get("text") or raw.get("body") or raw.get("message") or "").strip(),
        "received_at": str(raw.get("received_at") or raw.get("timestamp") or ""),
    }


# --------------------------------------------------------------------------- #
# Knowledge base
# --------------------------------------------------------------------------- #

def load_brands(path: Path = BRANDS_PATH) -> list[dict[str, Any]]:
    with open(path) as f:
        return json.load(f)["brands"]


# --------------------------------------------------------------------------- #
# Step 1: sender classification
# --------------------------------------------------------------------------- #

TYPE_NAMES = {v: k for k, v in vars(PhoneNumberType).items() if not k.startswith("_")}

# Email-to-SMS gateways. Sender that is an email address is itself a red flag.
EMAIL_SMS_GATEWAYS = {
    "vtext.com": "Verizon email-to-SMS gateway (closing 2027)",
    "vzwpix.com": "Verizon email-to-MMS gateway",
    "txt.att.net": "AT&T gateway (shut down June 2025, so this is spoofed)",
    "mms.att.net": "AT&T gateway (shut down June 2025, so this is spoofed)",
    "tmomail.net": "T-Mobile gateway (shut down Dec 2024, so this is spoofed)",
    "email.uscc.net": "US Cellular email-to-SMS gateway",
    "messaging.sprintpcs.com": "Sprint gateway (defunct)",
}


def classify_sender(sender: str) -> dict[str, Any]:
    s = sender.strip()
    info: dict[str, Any] = {"raw": s, "kind": "unknown"}

    if "@" in s:
        domain = s.rsplit("@", 1)[1].lower()
        info.update(kind="email", domain=domain)
        if domain in EMAIL_SMS_GATEWAYS:
            info["gateway"] = EMAIL_SMS_GATEWAYS[domain]
        return info

    digits = re.sub(r"\D", "", s)
    if 3 <= len(digits) <= 6 and not s.startswith("+"):
        info.update(
            kind="short_code",
            short_code=digits,
            registry_lookup=f"https://www.usshortcodes.com/find-short-code/?q={digits}",
        )
        return info

    try:
        num = phonenumbers.parse(s, DEFAULT_REGION)
    except phonenumbers.NumberParseException as e:
        info.update(kind="unparseable", error=str(e))
        return info

    ntype = phonenumbers.number_type(num)
    info.update(
        kind="long_code",
        e164=phonenumbers.format_number(num, phonenumbers.PhoneNumberFormat.E164),
        valid=phonenumbers.is_valid_number(num),
        country=phonenumbers.region_code_for_number(num),
        country_code=num.country_code,
        line_type=TYPE_NAMES.get(ntype, str(ntype)),
        location=geocoder.description_for_number(num, "en") or None,
        carrier=carrier.name_for_number(num, "en") or None,
    )
    return info


# --------------------------------------------------------------------------- #
# Step 2: which company does the message claim to be?
# --------------------------------------------------------------------------- #

def find_claimed_brands(text: str, brands: list[dict[str, Any]]) -> list[dict[str, Any]]:
    t = " " + text.lower() + " "
    hits = []
    for b in brands:
        for alias in b["aliases"]:
            a = alias.lower()
            pattern = r"(?<![a-z0-9])" + re.escape(a.strip()) + r"(?![a-z0-9])"
            if re.search(pattern, t):
                hits.append(b)
                break
    return hits


# --------------------------------------------------------------------------- #
# Step 3: does that company own this sender?
# --------------------------------------------------------------------------- #

def registered_domain(host: str) -> str:
    host = host.lower().strip(".")
    parts = host.split(".")
    two_level = {"co.uk", "org.uk", "com.au", "co.nz", "co.jp", "com.br", "co.in"}
    if len(parts) >= 3 and ".".join(parts[-2:]) in two_level:
        return ".".join(parts[-3:])
    return ".".join(parts[-2:]) if len(parts) >= 2 else host


def check_ownership(sender: dict[str, Any], brand: dict[str, Any]) -> dict[str, Any]:
    """Return {brand, status, reason}. status in CONFIRMED / UNVERIFIED / SUSPICIOUS / CONTRADICTED."""
    name = brand["name"]
    out = {"brand": name, "status": "UNVERIFIED", "reason": ""}

    if sender["kind"] == "short_code":
        code = sender["short_code"]
        if code in brand["short_codes"]:
            out.update(status="CONFIRMED", reason=f"Short code {code} is a published {name} short code.")
        else:
            out.update(
                status="UNVERIFIED",
                reason=f"Short code {code} is not in our list of known {name} codes. Check the US Short Code Registry.",
            )
        return out

    if sender["kind"] == "email":
        dom = registered_domain(sender["domain"])
        if dom in {registered_domain(d) for d in brand["domains"]}:
            out.update(status="UNVERIFIED", reason=f"Sender email domain matches {name}, but email senders are easily spoofed.")
        elif "gateway" in sender:
            out.update(status="CONTRADICTED", reason=f"{name} does not text via consumer email-to-SMS gateways ({sender['gateway']}).")
        else:
            out.update(status="CONTRADICTED", reason=f"Sender is an email address ({sender['domain']}), not a {name} number or short code.")
        return out

    if sender["kind"] == "long_code":
        if sender.get("e164") in brand["official_numbers"]:
            out.update(status="CONFIRMED", reason=f"{sender['e164']} is a published {name} customer number.")
            return out
        if brand["sms_policy"] == "never_initiates":
            out.update(status="CONTRADICTED", reason=f"{name} does not initiate texts like this. {brand['policy_text']}")
            return out
        if sender.get("country") != DEFAULT_REGION:
            out.update(status="CONTRADICTED", reason=f"Sender is a non-US number ({sender.get('country') or 'country unknown'}); {name} messages US customers from US short codes.")
            return out
        lt = sender.get("line_type", "")
        if lt == "TOLL_FREE":
            out.update(status="UNVERIFIED", reason=f"Toll-free number not on our {name} list. Businesses do text from toll-free numbers, so verify on {brand['domains'][0]}.")
        elif lt in ("MOBILE", "FIXED_LINE_OR_MOBILE", "FIXED_LINE", "VOIP"):
            out.update(status="SUSPICIOUS", reason=f"{name} sends from short codes such as {', '.join(brand['short_codes']) or 'n/a'}, not from a regular 10-digit {lt.replace('_', ' ').lower()} line.")
        else:
            out.update(status="SUSPICIOUS", reason=f"Unexpected line type {lt} for a {name} message.")
        return out

    out.update(status="UNVERIFIED", reason="Could not parse the sender.")
    return out


# --------------------------------------------------------------------------- #
# Step 4: URL and content signals
# --------------------------------------------------------------------------- #

URL_RE = re.compile(r"(?i)\b((?:https?://|www\.)[^\s<>\"']+|[a-z0-9-]+(?:\.[a-z0-9-]+)+\.[a-z]{2,}/[^\s<>\"']*|[a-z0-9-]+\.(?:com|net|org|info|top|xyz|club|vip|icu|cc|us|co|me|link|click|shop|online|site|live|app|cyou|cfd|sbs|buzz)(?:/[^\s<>\"']*)?)\b")

SHORTENERS = {"bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly", "cutt.ly", "rb.gy", "shorturl.at", "tiny.cc", "rebrand.ly", "t.ly", "s.id", "qrco.de"}
SUSPICIOUS_TLDS = {"top", "xyz", "club", "vip", "icu", "cc", "cyou", "cfd", "sbs", "buzz", "click", "link", "live", "online", "site", "shop", "info", "ru", "cn", "tk", "ml", "ga", "gq", "work", "rest", "lat", "bond", "win"}

CONTENT_PATTERNS = [
    (r"\b(urgent|immediately|within \d+ (hours?|minutes?)|expires? (today|soon)|final (notice|warning)|last chance|act now|right away)\b", 2, "Urgency or deadline pressure"),
    (r"\b(suspend(ed)?|locked|restricted|deactivat|on hold|frozen|closed)\b", 2, "Threat of account suspension or hold"),
    (r"\b(verify|confirm|update|validate) (your )?(account|identity|information|details|payment|card|address)\b", 2, "Request to verify or update account details"),
    (r"\b(unpaid|outstanding|overdue|owe|toll|fee|fine|penalty|late fee)\b", 2, "Claims you owe money"),
    (r"\b(password|passcode|pin|ssn|social security|one[- ]time code|otp|security code)\b", 3, "Asks for credentials or one-time codes"),
    (r"\b(gift ?card|bitcoin|crypto|wire transfer|zelle|western union|apple pay)\b", 2, "Unusual payment method"),
    (r"\b(package|parcel|delivery|shipment|redeliver|reschedule)\b.*\b(address|fee|pay|confirm)\b", 2, "Package-delivery pretext"),
    (r"reply\s+['\"]?y['\"]?(?![a-z])|reply\s+(yes|y)\b.*(reopen|exit|re-?open)|copy.*link.*safari|open.*in.*safari", 3, "Instructs you to reply Y or reopen the link (bypasses iMessage link blocking)"),
    (r"\b(dear (customer|user|member|client)|valued customer)\b", 1, "Generic greeting instead of your name"),
    (r"\b(you('ve| have) (won|been selected)|congratulations|claim your (prize|reward|refund))\b", 2, "Prize, reward, or refund bait"),
    (r"\b(tax refund|rebate|stimulus|relief fund)\b", 2, "Government-money bait"),
    (r"\b(wrong number|is this .{1,20}\?|hey stranger|long time)\b", 3, "Wrong-number opener (pig-butchering pattern)"),
]


def _brand_lookalike(host: str, brands: list[dict[str, Any]]) -> tuple[bool, str | None]:
    """True if host contains or resembles a brand name / official domain but is not official."""
    rd = registered_domain(host)
    label = rd.split(".")[0]
    for b in brands:
        officials = {registered_domain(d) for d in b["domains"]}
        if rd in officials or host in {d.lower() for d in b["domains"]}:
            return False, b["name"]
        tokens = [a.replace(" ", "").replace("-", "").replace(".", "") for a in b["aliases"] if len(a.strip()) >= 4]
        tokens.append(b["name"].lower().replace(" ", "").replace("-", ""))
        flat_host = host.replace("-", "").replace(".", "")
        for tok in tokens:
            if tok and tok in flat_host:
                return True, b["name"]
        for od in officials:
            if difflib.SequenceMatcher(None, label, od.split(".")[0]).ratio() >= 0.8:
                return True, b["name"]
    return False, None


def analyze_urls(text: str, brands: list[dict[str, Any]], claimed: list[dict[str, Any]]) -> list[dict[str, Any]]:
    results = []
    for m in URL_RE.finditer(text):
        raw = m.group(1).rstrip(".,;:!?)")
        url = raw if re.match(r"(?i)https?://", raw) else "http://" + raw
        try:
            parts = urlsplit(url)
        except ValueError:
            continue
        host = (parts.hostname or "").lower()
        if not host:
            continue
        rd = registered_domain(host)
        tld = rd.rsplit(".", 1)[-1]
        flags: list[str] = []
        score = 0

        if re.fullmatch(r"\d{1,3}(\.\d{1,3}){3}", host):
            flags.append("Link points to a bare IP address"); score += 3
        if host.startswith("xn--") or ".xn--" in host:
            flags.append("Punycode / homoglyph domain"); score += 3
        if rd in SHORTENERS:
            flags.append("URL shortener hides the real destination"); score += 2
        if tld in SUSPICIOUS_TLDS:
            flags.append(f"Suspicious top-level domain .{tld}"); score += 2
        lookalike, brand_name = _brand_lookalike(host, brands)
        official_for = None if lookalike else brand_name
        if not raw.lower().startswith("https://") and not official_for:
            flags.append("Not HTTPS (or scheme omitted)"); score += 1
        if host.count("-") >= 2 or len(host) > 30:
            flags.append("Long or hyphen-heavy hostname"); score += 1
        if len(host.split(".")) >= 4:
            flags.append("Deeply nested subdomain (brand name likely buried in a subdomain)"); score += 1

        if lookalike:
            flags.append(f"Lookalike of {brand_name}: domain mentions the brand but is not an official {brand_name} domain"); score += 4
        elif official_for:
            flags.append(f"Official {official_for} domain"); score -= 2
        elif claimed:
            names = ", ".join(b["name"] for b in claimed)
            flags.append(f"Message claims to be {names} but link goes to unrelated domain {rd}"); score += 3

        results.append({"url": raw, "host": host, "registered_domain": rd, "flags": flags, "score": max(score, 0), "official_brand": official_for})
    return results


def analyze_content(text: str, sender: dict[str, Any]) -> list[dict[str, Any]]:
    hits = []
    low = text.lower()
    for pattern, weight, label in CONTENT_PATTERNS:
        if re.search(pattern, low):
            hits.append({"signal": label, "weight": weight})
    # Callback number in body that differs from the sender.
    for match in phonenumbers.PhoneNumberMatcher(text, DEFAULT_REGION):
        e164 = phonenumbers.format_number(match.number, phonenumbers.PhoneNumberFormat.E164)
        if e164 != sender.get("e164"):
            hits.append({"signal": f"Asks you to call a different number ({e164}) than the sender", "weight": 2})
            break
    return hits


# --------------------------------------------------------------------------- #
# Step 5: scoring
# --------------------------------------------------------------------------- #

OWNERSHIP_WEIGHT = {"CONFIRMED": -4, "UNVERIFIED": 1, "SUSPICIOUS": 3, "CONTRADICTED": 5}


def score_report(sender, ownership, urls, content) -> tuple[int, str, list[str]]:
    score = 0
    reasons: list[str] = []

    if sender["kind"] == "email":
        score += 3
        reasons.append("Sender is an email address, not a phone number" + (f" ({sender['gateway']})" if sender.get("gateway") else ""))
    if sender["kind"] == "long_code":
        if sender.get("valid") is False:
            score += 2; reasons.append("Sender number is not a valid phone number")
        if sender.get("country") != DEFAULT_REGION:
            score += 2; reasons.append(f"Sender is a non-US number ({sender.get('country') or 'country unknown'})")

    for o in ownership:
        score += OWNERSHIP_WEIGHT[o["status"]]
        reasons.append(f"{o['brand']} ownership {o['status']}: {o['reason']}")

    for u in urls:
        score += u["score"]
        for fl in u["flags"]:
            if not fl.startswith("Official"):
                reasons.append(f"Link {u['host']}: {fl}")

    for c in content:
        score += c["weight"]
        reasons.append(c["signal"])

    if score >= 7:
        level = "Likely Scam"
    elif score >= 3:
        level = "Suspicious"
    else:
        level = "Safe"
    return score, level, reasons


# --------------------------------------------------------------------------- #
# Step 6: Claude verdict (optional)
# --------------------------------------------------------------------------- #

CLAUDE_MODEL = "claude-opus-5"

SYSTEM_PROMPT = """You are a fraud analyst reviewing one SMS message for a consumer.
You receive the raw message plus an evidence bundle produced by offline checks:
sender classification (from libphonenumber), whether the company named in the message
plausibly owns the sender, URL analysis, and content pattern hits.

Weigh the evidence and decide. The strongest single signals are:
(1) the claimed company is CONTRADICTED as owner of the sender, (2) a lookalike domain,
(3) instructions to reply Y or reopen a link, (4) a company that never initiates texts.
Unverified ownership alone is not proof of fraud. Legitimate 2FA codes and delivery
updates from known short codes should be Safe.

Write for a non-technical person. Reasons must be concrete and reference the evidence.
Recommended action should be one or two short sentences (e.g. do not tap the link,
forward to 7726, check the account via the official app)."""


def claude_verdict(evidence: dict[str, Any]) -> dict[str, Any] | None:
    try:
        import anthropic
        from pydantic import BaseModel
    except ImportError:
        return None

    class Verdict(BaseModel):
        risk_level: str  # "Safe" | "Suspicious" | "Likely Scam"
        confidence: float
        headline: str
        company_ownership_assessment: str
        reasons: list[str]
        recommended_action: str

    client = anthropic.Anthropic()
    try:
        resp = client.messages.parse(
            model=CLAUDE_MODEL,
            max_tokens=4000,
            system=SYSTEM_PROMPT,
            output_config={"effort": "medium"},
            messages=[{"role": "user", "content": "Evidence bundle:\n" + json.dumps(evidence, indent=2)}],
            output_format=Verdict,
        )
    except anthropic.AuthenticationError:
        return {"error": "auth", "detail": "No valid Anthropic credential"}
    except anthropic.RateLimitError:
        return {"error": "rate_limit"}
    except anthropic.APIStatusError as e:
        return {"error": f"api_{e.status_code}", "detail": e.message}
    except anthropic.APIConnectionError:
        return {"error": "network"}

    if resp.stop_reason == "refusal" or resp.parsed_output is None:
        return {"error": "refusal_or_empty"}
    v = resp.parsed_output
    if v.risk_level not in ("Safe", "Suspicious", "Likely Scam"):
        v.risk_level = "Suspicious"
    return {"model": resp.model, **v.model_dump()}


# --------------------------------------------------------------------------- #
# Public entry point
# --------------------------------------------------------------------------- #

def investigate(sender: str, text: str, *, use_claude: bool = True, brands: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    brands = brands or load_brands()
    sender_info = classify_sender(sender)
    claimed = find_claimed_brands(text, brands)
    ownership = [check_ownership(sender_info, b) for b in claimed]
    urls = analyze_urls(text, brands, claimed)
    content = analyze_content(text, sender_info)
    score, level, reasons = score_report(sender_info, ownership, urls, content)

    report: dict[str, Any] = {
        "input": {"sender": sender, "text": text},
        "sender": sender_info,
        "claimed_companies": [b["name"] for b in claimed],
        "company_ownership": ownership,
        "urls": urls,
        "content_signals": content,
        "offline_verdict": {"score": score, "risk_level": level, "reasons": reasons},
        "verdict_source": "offline",
        "risk_level": level,
    }

    if use_claude:
        evidence = {k: report[k] for k in ("input", "sender", "claimed_companies", "company_ownership", "urls", "content_signals", "offline_verdict")}
        cv = claude_verdict(evidence)
        report["claude_verdict"] = cv
        if cv and "error" not in cv:
            report["verdict_source"] = "claude"
            report["risk_level"] = cv["risk_level"]
    return report


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("usage: python investigate.py <sender> <text...>")
        sys.exit(1)
    print(json.dumps(investigate(sys.argv[1], " ".join(sys.argv[2:])), indent=2))
