// AI Opportunity Finder engine: match text messages against the Claude feature catalog.
// ponytail: substring keyword matching, swap for a Claude API call later.

// "[2024-09-02 6:12 PM] Maya: text" -> { from, text }. Skips '#' comments and blank lines.
function parseChat(raw) {
  return raw.split('\n')
    .map(l => l.match(/^\[[^\]]+\]\s*([^:]+):\s*(.+)$/))
    .filter(Boolean)
    .map(m => ({ from: m[1].trim(), text: m[2].trim() }));
}

// Catalog signals found in one message.
function signalsIn(text, catalog) {
  const t = text.toLowerCase();
  return [...new Set(catalog.flatMap(e => e.signals.filter(s => t.includes(s))))];
}

// Buckets that turn matches into a "you are..." label.
const ARCHETYPES = [
  { name: 'The Client Juggler', blurb: 'Lots of people, lots of details, and it all lives in your head.',
    ids: ['tennis-coach-client-tracker', 'projects', 'artifacts', 'cowork-projects', 'hubspot-connector', 'lead-qualification-autoreply', 'freelancer-hubspot-lead-triage', 'tutor-progress-project', 'club-organizer-live-dashboard'] },
  { name: 'The Scheduler', blurb: 'Most of your texts are about when. Moving times around eats your day.',
    ids: ['google-calendar-connector', 'trainer-calendar-connector', 'salon-gmail-triage', 'weekly-calendar-inbox-prep', 'meeting-calendar-prep', 'mobile-app-integrations', 'cowork-scheduled-tasks', 'claude-code-desktop-scheduled-tasks'] },
  { name: 'The Money Chaser', blurb: 'You spend real time tracking who paid, who owes and what came in.',
    ids: ['invoice-and-followup-automation', 'cash-flow-monday-brief', 'contractor-invoice-followup-task', 'contractor-quickbooks-reconcile', 'landlord-rent-tracker-excel', 'claude-for-excel', 'file-upload-analysis'] },
  { name: 'The Paperwork Person', blurb: 'Quotes, contracts and files keep landing on your plate.',
    ids: ['create-edit-files', 'cowork-desktop-agent', 'proposal-generation', 'freelancer-proposal-docx', 'contractor-docusign-tracking', 'compare-vendor-quotes', 'google-drive-connector', 'auto-organize-local-files'] },
  { name: 'The Planner', blurb: "You're the one figuring out where, when and what everyone's doing.",
    ids: ['daily-travel-itinerary', 'compare-travel-destinations', 'compare-products-across-tabs', 'research-mode', 'web-search', 'asana-connector', 'student-study-tracker-artifact', 'research-to-presentation'] },
  { name: 'The Promoter', blurb: 'You need people to find you, and posting about it takes time.',
    ids: ['on-brand-marketing-content', 'social-content-calendar', 'salon-canva-social', 'diy-portfolio-booking-page'] },
];

// messages: [{ from, text }] -> { archetype, top, signalCount }
function analyze(messages, catalog, limit = 3) {
  const scored = catalog
    .map(entry => {
      const hits = messages.filter(m => entry.signals.some(s => m.text.toLowerCase().includes(s)));
      return { ...entry, hits: hits.length, score: hits.length * (entry.technical ? 0.3 : 1), evidence: hits.slice(0, 2).map(m => m.text) };
    })
    .filter(r => r.hits > 0)
    .sort((a, b) => b.score - a.score);

  const seen = new Set(); // one card per feature, e.g. don't show Artifacts twice
  const top = scored.filter(r => !seen.has(r.feature) && seen.add(r.feature)).slice(0, limit);

  const hitsById = Object.fromEntries(scored.map(r => [r.id, r.hits]));
  const archetype = ARCHETYPES
    .map(a => ({ ...a, score: a.ids.reduce((sum, id) => sum + (hitsById[id] || 0), 0) }))
    .sort((a, b) => b.score - a.score)[0];

  const signalCount = new Set(messages.flatMap(m => signalsIn(m.text, catalog))).size;
  return { archetype, top, signalCount };
}

if (typeof module !== 'undefined') module.exports = { parseChat, signalsIn, analyze, ARCHETYPES };
