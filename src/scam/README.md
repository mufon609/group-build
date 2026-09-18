# Scam Detection: phishing SMS investigator

Takes one incoming text (sender + body) and produces an investigation report.
Two builds of the same engine, same rules, same output shape:

- **Browser / JavaScript** (`scam.js` + `brands.js`): drop-in for the app page. No network, no key.
- **Python** (`investigate.py`): CLI + Markdown report, optional Claude verdict step.

## Try the browser demo

Open `src/scam/index.html` in a browser. Nothing to install.
Pitch deck: open `src/scam/slides.html` (arrow keys or click to advance).

## Plug into the app page (for the frontend owner)

```html
<script src="../scam/brands.js"></script>
<script src="../scam/scam.js"></script>
<script>
  const messages = parseThreadLog(rawLogText);       // "[time] Sender: text" lines, skips "Me"
  for (const m of messages) {
    const r = investigate(m.sender, m.text);
    // r.risk_level            -> "Safe" | "Suspicious" | "Likely Scam"
    // r.claimed_companies     -> ["USPS"]
    // r.company_ownership     -> [{brand, status: CONFIRMED|UNVERIFIED|SUSPICIOUS|CONTRADICTED, reason}]
    // r.urls                  -> [{host, flags: [...]}]
    // r.offline_verdict.reasons, r.recommended_action
  }
</script>
```

Node works too: `const { investigate, parseThreadLog } = require('./src/scam/scam.js')`.

## Python CLI

## Run

```bash
pip install -r requirements.txt
python src/scam/run_demo.py                 # demo inbox, Claude verdict if key present
python src/scam/run_demo.py --no-claude     # offline heuristics only
python src/scam/run_demo.py --json          # machine-readable reports
python src/scam/run_demo.py --md --quiet    # write reports/investigation_report.md
python src/scam/run_demo.py --log demo-data/scam-thread.txt --md   # team text-log format
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

## Input formats

- **Team text log** (Noah's format): `[2024-09-03 9:14 AM] Sender: text`. Use `--log` in Python
  or `parseThreadLog()` in JS. Lines from `Me` are skipped by default.
- **JSON inbox**: `[{"sender": "...", "text": "..."}]`. Use `--file`.
- Anything else: edit `normalize_incoming()` in `investigate.py`, nothing downstream changes.

The sender may be a phone number, short code, email address, or a plain contact name.
Names can't be ownership-checked, so a name claiming to be a brand comes back UNVERIFIED.

## Keeping the two builds in sync

`brands.json` is the source of truth. After editing it run
`python3 src/scam/build_brands_js.py` to regenerate `brands.js`.
Rules live in both `investigate.py` and `scam.js`; the demo inbox is the parity test
(both must produce identical levels and scores).

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
