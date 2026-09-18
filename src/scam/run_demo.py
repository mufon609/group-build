"""
Run the phishing investigator against the demo inbox (or a single message).

  python src/scam/run_demo.py                      # all demo messages, pretty output
  python src/scam/run_demo.py --json               # JSON report per message
  python src/scam/run_demo.py --no-claude          # offline heuristics only
  python src/scam/run_demo.py --sender 24273 --text "Chase: ..."
  python src/scam/run_demo.py --file path/to/inbox.json
  python src/scam/run_demo.py --md reports/investigation_report.md   # write Markdown summary
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from investigate import investigate, normalize_incoming  # noqa: E402
from report_md import render  # noqa: E402

DEMO_FILE = Path(__file__).resolve().parents[2] / "demo-data" / "sample_texts.json"
DEFAULT_MD = Path(__file__).resolve().parents[2] / "reports" / "investigation_report.md"

COLORS = {"Safe": "\033[92m", "Suspicious": "\033[93m", "Likely Scam": "\033[91m"}
RESET = "\033[0m"


def pretty(report: dict) -> str:
    lvl = report["risk_level"]
    c = COLORS.get(lvl, "")
    lines = [
        f"{c}[{lvl.upper()}]{RESET}  from {report['input']['sender']}  (verdict: {report['verdict_source']})",
        f"  \"{report['input']['text'][:140]}{'...' if len(report['input']['text']) > 140 else ''}\"",
    ]
    s = report["sender"]
    if s["kind"] == "long_code":
        lines.append(f"  Sender: {s.get('e164')}  {s.get('line_type')}  {s.get('country')}  {s.get('location') or ''}")
    elif s["kind"] == "short_code":
        lines.append(f"  Sender: short code {s['short_code']}")
    else:
        lines.append(f"  Sender: {s['kind']} {s.get('domain', '')}")
    if report["claimed_companies"]:
        lines.append(f"  Claims to be: {', '.join(report['claimed_companies'])}")
        for o in report["company_ownership"]:
            lines.append(f"    - {o['brand']} ownership: {o['status']}. {o['reason']}")
    cv = report.get("claude_verdict")
    if cv and "error" not in cv:
        lines.append(f"  Claude: {cv['headline']}  (confidence {cv['confidence']:.0%})")
        for r in cv["reasons"]:
            lines.append(f"    - {r}")
        lines.append(f"  Action: {cv['recommended_action']}")
    else:
        if cv and "error" in cv:
            lines.append(f"  (Claude unavailable: {cv['error']}; showing offline verdict)")
        for r in [x for x in report["offline_verdict"]["reasons"] if " ownership " not in x][:6]:
            lines.append(f"    - {r}")
    return "\n".join(lines)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", type=Path, default=DEMO_FILE)
    ap.add_argument("--sender")
    ap.add_argument("--text")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--no-claude", action="store_true")
    ap.add_argument("--md", type=Path, nargs="?", const=DEFAULT_MD, help="write a Markdown summary report (default: reports/investigation_report.md)")
    ap.add_argument("--quiet", action="store_true", help="do not print per-message output to the terminal")
    args = ap.parse_args()

    if args.sender and args.text:
        messages = [{"id": "adhoc", "sender": args.sender, "text": args.text}]
    else:
        with open(args.file) as f:
            messages = json.load(f)

    reports = []
    for raw in messages:
        msg = normalize_incoming(raw)
        report = investigate(msg["sender"], msg["text"], use_claude=not args.no_claude)
        report["id"] = msg["id"]
        reports.append(report)
        if not args.json and not args.quiet:
            print(pretty(report))
            print()
    if args.json:
        print(json.dumps(reports, indent=2))
    if args.md:
        args.md.parent.mkdir(parents=True, exist_ok=True)
        args.md.write_text(render(reports))
        print(f"Markdown report written to {args.md}")


if __name__ == "__main__":
    main()
