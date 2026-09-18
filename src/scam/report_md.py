"""Render investigation reports to a Markdown summary file."""

from __future__ import annotations

from datetime import datetime, timezone

BADGE = {"Safe": "🟢 Safe", "Suspicious": "🟡 Suspicious", "Likely Scam": "🔴 Likely Scam"}


def _sender_line(s: dict) -> str:
    if s["kind"] == "long_code":
        bits = [s.get("e164") or s["raw"], (s.get("line_type") or "").replace("_", " ").title(), s.get("country") or "country unknown", s.get("location") or ""]
        return " · ".join(b for b in bits if b)
    if s["kind"] == "short_code":
        return f"Short code {s['short_code']} ([registry lookup]({s['registry_lookup']}))"
    if s["kind"] == "email":
        return f"Email address `{s['raw']}`" + (f" ({s['gateway']})" if s.get("gateway") else "")
    return s["raw"]


def render(reports: list[dict], title: str = "Phishing Text Investigation Report") -> str:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    counts = {"Likely Scam": 0, "Suspicious": 0, "Safe": 0}
    for r in reports:
        counts[r["risk_level"]] = counts.get(r["risk_level"], 0) + 1

    out = [f"# {title}", "", f"Generated {now}. {len(reports)} messages analyzed.", ""]
    out += ["| Verdict | Count |", "|---|---|"]
    out += [f"| {BADGE[k]} | {v} |" for k, v in counts.items()]
    out += ["", "## Summary", "", "| # | Verdict | Sender | Claims to be | Company owns sender? | Message |", "|---|---|---|---|---|---|"]
    for i, r in enumerate(reports, 1):
        claims = ", ".join(r["claimed_companies"]) or "—"
        own = ", ".join(o["status"].title() for o in r["company_ownership"]) or "—"
        text = r["input"]["text"].replace("|", "\\|").replace("\n", " ")
        text = text[:70] + ("…" if len(text) > 70 else "")
        out.append(f"| {i} | {BADGE[r['risk_level']]} | `{r['input']['sender']}` | {claims} | {own} | {text} |")

    out += ["", "## Details", ""]
    for i, r in enumerate(reports, 1):
        out.append(f"### {i}. {BADGE[r['risk_level']]} — from `{r['input']['sender']}`")
        out.append("")
        out.append(f"> {r['input']['text']}")
        out.append("")
        out.append(f"**Sender:** {_sender_line(r['sender'])}  ")
        if r["claimed_companies"]:
            out.append(f"**Claims to be:** {', '.join(r['claimed_companies'])}  ")
            for o in r["company_ownership"]:
                out.append(f"**{o['brand']} owns this sender?** {o['status'].title()}. {o['reason']}  ")
        else:
            out.append("**Claims to be:** no company named  ")
        out.append("")

        cv = r.get("claude_verdict")
        if cv and "error" not in cv:
            out.append(f"**Analyst verdict:** {cv['headline']} (confidence {cv['confidence']:.0%})")
            out.append("")
            out += [f"- {x}" for x in cv["reasons"]]
            out.append("")
            out.append(f"**Recommended action:** {cv['recommended_action']}")
        else:
            reasons = [x for x in r["offline_verdict"]["reasons"] if " ownership " not in x]
            if reasons:
                out.append("**Why:**")
                out.append("")
                out += [f"- {x}" for x in reasons]
            else:
                out.append("**Why:** no scam signals found.")
            out.append("")
            out.append(f"**Recommended action:** {_default_action(r['risk_level'])}")
        if r["urls"]:
            out.append("")
            out.append("**Links found:**")
            out.append("")
            for u in r["urls"]:
                flags = "; ".join(u["flags"]) or "no flags"
                out.append(f"- `{u['host']}` — {flags}")
        out.append("")
        out.append("---")
        out.append("")
    return "\n".join(out)


def _default_action(level: str) -> str:
    return {
        "Likely Scam": "Do not tap the link or reply. Forward the text to 7726 (SPAM) and delete it. If it names a company you use, check your account through the official app only.",
        "Suspicious": "Do not tap any link. Verify by contacting the company through its official app or website, not the number in the text.",
        "Safe": "No action needed. If anything feels off, verify through the official app.",
    }[level]
