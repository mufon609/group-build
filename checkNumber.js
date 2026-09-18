const MOCK = false;

// Throwaway demo key for apilayer's numverify API. Rotate before any real use.
const NUMVERIFY_ACCESS_KEY = "3067efa2a13ac9ebcf849b748889460c";
const NUMVERIFY_TIMEOUT_MS = 3000;

// Three canned responses for demoing without hitting numverify. Also used as the
// automatic fallback below when the real call fails or times out, so the demo
// never hangs on a dead/rate-limited API.
const mockResponses = {
  safe: {
    fraud_score: 12,
    VOIP: false,
    recent_abuse: false,
    carrier: "Verizon",
    line_type: "Wireless",
    active: true,
  },
  suspicious: {
    fraud_score: 62,
    VOIP: true,
    recent_abuse: false,
    carrier: "Bandwidth.com",
    line_type: "VOIP",
    active: true,
  },
  scammer: {
    fraud_score: 87,
    VOIP: true,
    recent_abuse: true,
    carrier: "Twilio",
    line_type: "VOIP",
    active: true,
  },
};

// numverify doesn't return a fraud score, so we derive a rough stand-in:
//   VOIP line          +50
//   invalid number     +40
//   carrier empty/unknown +25
//   mobile/landline    +0
// capped at 100.
function deriveFraudScore(data) {
  let score = 0;
  const lineType = (data.line_type || "").toLowerCase();
  const carrier = (data.carrier || "").trim().toLowerCase();

  if (lineType === "voip") score += 50;
  if (!data.valid) score += 40;
  if (!carrier || carrier === "unknown") score += 25;

  return Math.min(score, 100);
}

function mapNumverifyResponse(data) {
  const fraud_score = deriveFraudScore(data);
  return {
    fraud_score,
    VOIP: (data.line_type || "").toLowerCase() === "voip",
    // numverify has no abuse signal; approximate from the derived score since
    // there's nothing real to report here.
    recent_abuse: fraud_score > 60,
    carrier: data.carrier && data.carrier.trim() ? data.carrier : "Unknown",
    line_type: data.line_type || "unknown",
    active: !!data.valid,
  };
}

async function checkNumber(num) {
  if (MOCK) {
    return mockResponses.scammer;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), NUMVERIFY_TIMEOUT_MS);
    const url = `http://apilayer.net/api/validate?access_key=${NUMVERIFY_ACCESS_KEY}&number=${encodeURIComponent(num)}`;

    let res;
    try {
      res = await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      throw new Error(`numverify request failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (data.success === false) {
      throw new Error(`numverify error: ${data.error?.info || data.error?.type || "unknown"}`);
    }

    return mapNumverifyResponse(data);
  } catch (err) {
    const reason = err.name === "AbortError" ? "timed out after 3s" : err.message;
    console.warn(`\x1b[33m⚠ numverify call failed for ${num} (${reason}) — using mock fallback.\x1b[0m`);
    return mockResponses.scammer;
  }
}

function getVerdict(score) {
  if (score > 60) return { label: "LIKELY SCAM", color: "\x1b[41m\x1b[97m" }; // white on red
  if (score >= 30) return { label: "SUSPICIOUS", color: "\x1b[43m\x1b[30m" }; // black on yellow
  return { label: "SAFE", color: "\x1b[42m\x1b[30m" }; // black on green
}

function printScenario(title, number, data) {
  const RESET = "\x1b[0m";
  const BOLD = "\x1b[1m";
  const DIM = "\x1b[2m";
  const verdict = getVerdict(data.fraud_score);
  const width = 46;
  const bar = "═".repeat(width);

  console.log(`\n${BOLD}╔${bar}╗${RESET}`);
  console.log(`${BOLD}║ ${title.padEnd(width - 1)}║${RESET}`);
  console.log(`${BOLD}╟${bar}╢${RESET}`);
  console.log(`║ ${DIM}Number:${RESET}       ${number.padEnd(width - 15)}║`);
  console.log(`║ ${DIM}Fraud Score:${RESET}  ${String(data.fraud_score).padEnd(width - 15)}║`);
  console.log(`║ ${DIM}Carrier:${RESET}      ${data.carrier.padEnd(width - 15)}║`);
  console.log(`║ ${DIM}Line Type:${RESET}    ${data.line_type.padEnd(width - 15)}║`);
  console.log(`║ ${DIM}VOIP:${RESET}         ${String(data.VOIP).padEnd(width - 15)}║`);
  console.log(`║ ${DIM}Recent Abuse:${RESET} ${String(data.recent_abuse).padEnd(width - 15)}║`);
  console.log(`║ ${DIM}Active:${RESET}       ${String(data.active).padEnd(width - 15)}║`);
  console.log(`${BOLD}╟${bar}╢${RESET}`);
  console.log(
    `║ ${DIM}Verdict:${RESET}      ${verdict.color}${BOLD} ${verdict.label} ${RESET}${" ".repeat(
      Math.max(width - 15 - verdict.label.length - 2, 0)
    )}║`
  );
  console.log(`${BOLD}╚${bar}╝${RESET}`);
}

const demoNumbers = [
  { title: "Check 1: US Mobile", number: "14158586273" },
  { title: "Check 2: Twilio Test Line", number: "15005550006" },
  { title: "Check 3: Unassigned/Invalid", number: "19999999999" },
];

async function runDemo() {
  console.log(`\x1b[1mNumber Risk Check — MOCK mode is ${MOCK ? "ON" : "OFF"}\x1b[0m`);
  for (const { title, number } of demoNumbers) {
    const data = await checkNumber(number);
    printScenario(title, number, data);
  }
  console.log();
}

if (require.main === module) {
  runDemo();
}

module.exports = { checkNumber, mockResponses, MOCK };
