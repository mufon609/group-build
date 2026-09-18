"""Regenerate brands.js from brands.json so the browser build needs no fetch()."""
import json
from pathlib import Path

here = Path(__file__).parent
brands = json.load(open(here / "brands.json"))["brands"]
out = "// GENERATED from brands.json (python3 src/scam/build_brands_js.py). Do not edit by hand.\n"
out += "const BRANDS = " + json.dumps(brands, indent=2) + ";\n"
out += "if (typeof module !== 'undefined') module.exports = { BRANDS };\n"
(here / "brands.js").write_text(out)
print("wrote", here / "brands.js")
