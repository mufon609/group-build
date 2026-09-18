# Scam Detection: phishing SMS investigator

Takes one incoming text (sender + body) and produces an investigation report.
Offline path needs only `phonenumbers`. If an Anthropic credential is present,
Claude writes the final verdict and plain-language explanation.

## Run

```bash
pip install -r requirements.txt
python src/scam/run_demo.py                 # demo inbox, Claude verdict if key present
python src/scam/run_demo.py --no-claude     # offline heuristics only
python src/scam/run_demo.py --json          # machine-readable reports
python src/scam/run_demo.py --sender 24273 --text "Chase: Did you attempt..."
export ANTHROPIC_API_KEY=sk-ant-...         # enables the Claude verdict step
```

## Flow

1. **Classify sender** (`classify_sender`): short code, 10-digit long code, or email.
   Long codes go through libphonenumber for validity, country, line type, region.
2. **Find claimed company** (`find_claimed_brands`): alias match against `brands.json`.
3. **Ownership check** (`check_ownership`): does that company plausibly own the sender?
   - Short code in the brand's published list: CONFIRMED
   - Brand policy says it never initiates texts (USPS, IRS, E-ZPass, DMV...): CONTRADICTED
   - Foreign number or email sender: CONTRADICTED
   - Consumer 10-digit line for a short-code brand: SUSPICIOUS
   - Toll-free / unknown short code: UNVERIFIED
4. **URL analysis**: lookalike domains, shorteners, risky TLDs, IP hosts, punycode.
5. **Content signals**: urgency, suspension threats, owed money, reply-Y trick, prize bait.
6. **Score** into Safe / Suspicious / Likely Scam, then optional Claude verdict.

## Plugging in the real log format

Edit only `normalize_incoming()` in `investigate.py`. It maps the upstream
record to `{id, sender, text, received_at}`. Everything downstream is unchanged.

## Output shape (per message)

```json
{
  "risk_level": "Likely Scam",
  "verdict_source": "claude | offline",
  "sender": {"kind": "long_code", "e164": "+1...", "line_type": "...", "country": "US"},
  "claimed_companies": ["USPS"],
  "company_ownership": [{"brand": "USPS", "status": "CONTRADICTED", "reason": "..."}],
  "urls": [{"host": "...", "flags": ["..."]}],
  "content_signals": [{"signal": "...", "weight": 2}],
  "offline_verdict": {"score": 14, "risk_level": "Likely Scam", "reasons": ["..."]},
  "claude_verdict": {"headline": "...", "reasons": ["..."], "recommended_action": "..."}
}
```

`brands.json` short codes were compiled from public brand help pages for the demo.
Verify before relying on them in production.
