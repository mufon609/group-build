// Scam Detection engine (browser + Node). Port of investigate.py.
//
//   const report = investigate(sender, text);            // one message
//   const msgs   = parseThreadLog(rawLogText);           // "[time] Sender: text" lines
//   report.risk_level -> "Safe" | "Suspicious" | "Likely Scam"
//
// Requires BRANDS (from brands.js). No network, no API key.

(function (root) {
  'use strict';

  const brands = () => (typeof BRANDS !== 'undefined' ? BRANDS : require('./brands.js').BRANDS);

  // ---------------------------------------------------------------- input
  const LOG_LINE_RE = /^\[([^\]]+)\]\s*([^:]+):\s*(.+)$/;

  function parseThreadLog(raw, { skipFrom = ['Me'] } = {}) {
    const out = [];
    raw.split('\n').forEach((line, i) => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;
      const m = line.match(LOG_LINE_RE);
      if (!m) return;
      const sender = m[2].trim();
      if (skipFrom.includes(sender)) return;
      out.push({ id: `line-${i + 1}`, sender, text: m[3].trim(), received_at: m[1].trim() });
    });
    return out;
  }

  // ---------------------------------------------------------------- sender
  const EMAIL_SMS_GATEWAYS = {
    'vtext.com': 'Verizon email-to-SMS gateway (closing 2027)',
    'vzwpix.com': 'Verizon email-to-MMS gateway',
    'txt.att.net': 'AT&T gateway (shut down June 2025, so this is spoofed)',
    'mms.att.net': 'AT&T gateway (shut down June 2025, so this is spoofed)',
    'tmomail.net': 'T-Mobile gateway (shut down Dec 2024, so this is spoofed)',
    'email.uscc.net': 'US Cellular email-to-SMS gateway',
    'messaging.sprintpcs.com': 'Sprint gateway (defunct)',
  };
  const TOLL_FREE = /^(800|888|877|866|855|844|833|822)$/;
  const PREMIUM = /^900$/;
  // Country calling codes we can name without libphonenumber. Others show as "non-US".
  const COUNTRY_CODES = [['44', 'GB'], ['33', 'FR'], ['49', 'DE'], ['34', 'ES'], ['39', 'IT'], ['31', 'NL'], ['32', 'BE'], ['41', 'CH'], ['43', 'AT'], ['46', 'SE'], ['47', 'NO'], ['45', 'DK'], ['48', 'PL'], ['351', 'PT'], ['353', 'IE'], ['358', 'FI'], ['380', 'UA'], ['7', 'RU'], ['52', 'MX'], ['55', 'BR'], ['54', 'AR'], ['57', 'CO'], ['91', 'IN'], ['92', 'PK'], ['86', 'CN'], ['81', 'JP'], ['82', 'KR'], ['84', 'VN'], ['66', 'TH'], ['63', 'PH'], ['62', 'ID'], ['60', 'MY'], ['65', 'SG'], ['61', 'AU'], ['64', 'NZ'], ['27', 'ZA'], ['234', 'NG'], ['20', 'EG'], ['90', 'TR'], ['971', 'AE'], ['966', 'SA'], ['972', 'IL'], ['852', 'HK'], ['886', 'TW'], ['855', 'KH'], ['95', 'MM'], ['856', 'LA']];
  // NANP countries that are not the US (Caribbean scam numbers look like US numbers).
  const NANP_NON_US = { '242': 'BS', '246': 'BB', '264': 'AI', '268': 'AG', '284': 'VG', '345': 'KY', '441': 'BM', '473': 'GD', '649': 'TC', '658': 'JM', '664': 'MS', '758': 'LC', '767': 'DM', '784': 'VC', '809': 'DO', '829': 'DO', '849': 'DO', '868': 'TT', '869': 'KN', '876': 'JM', '204': 'CA', '226': 'CA', '236': 'CA', '249': 'CA', '250': 'CA', '289': 'CA', '306': 'CA', '343': 'CA', '365': 'CA', '403': 'CA', '416': 'CA', '418': 'CA', '431': 'CA', '437': 'CA', '438': 'CA', '450': 'CA', '506': 'CA', '514': 'CA', '519': 'CA', '548': 'CA', '579': 'CA', '581': 'CA', '587': 'CA', '604': 'CA', '613': 'CA', '639': 'CA', '647': 'CA', '672': 'CA', '705': 'CA', '709': 'CA', '778': 'CA', '780': 'CA', '782': 'CA', '807': 'CA', '819': 'CA', '825': 'CA', '867': 'CA', '873': 'CA', '902': 'CA', '905': 'CA' };

  function classifySender(sender) {
    const s = String(sender || '').trim();
    const info = { raw: s, kind: 'unknown' };

    if (s.includes('@')) {
      const domain = s.split('@').pop().toLowerCase();
      info.kind = 'email'; info.domain = domain;
      if (EMAIL_SMS_GATEWAYS[domain]) info.gateway = EMAIL_SMS_GATEWAYS[domain];
      return info;
    }
    const digits = s.replace(/\D/g, '');
    if (!digits) { info.kind = 'name'; info.name = s; return info; }
    if (digits.length >= 3 && digits.length <= 6 && !s.startsWith('+')) {
      info.kind = 'short_code'; info.short_code = digits;
      info.registry_lookup = `https://www.usshortcodes.com/find-short-code/?q=${digits}`;
      return info;
    }

    info.kind = 'long_code';
    let national = null;
    if (s.startsWith('+') && !digits.startsWith('1')) {
      const cc = COUNTRY_CODES.find(([c]) => digits.startsWith(c));
      info.e164 = '+' + digits;
      info.country = cc ? cc[1] : null;
      info.country_code = cc ? Number(cc[0]) : null;
      info.valid = digits.length >= 8 && digits.length <= 15;
      info.line_type = 'UNKNOWN';
      return info;
    }
    if (digits.length === 11 && digits.startsWith('1')) national = digits.slice(1);
    else if (digits.length === 10) national = digits;
    if (!national) {
      info.kind = 'unparseable'; info.error = `Unrecognized number "${s}"`; return info;
    }
    const area = national.slice(0, 3), exch = national.slice(3, 6);
    info.e164 = '+1' + national;
    info.country_code = 1;
    info.country = NANP_NON_US[area] || 'US';
    info.valid = /^[2-9]/.test(area) && /^[2-9]/.test(exch);
    info.line_type = TOLL_FREE.test(area) ? 'TOLL_FREE' : PREMIUM.test(area) ? 'PREMIUM_RATE' : 'FIXED_LINE_OR_MOBILE';
    info.location = null;
    return info;
  }

  // ---------------------------------------------------------------- brands
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function findClaimedBrands(text) {
    const t = ' ' + text.toLowerCase() + ' ';
    return brands().filter(b => b.aliases.some(a => new RegExp(`(?<![a-z0-9])${esc(a.trim().toLowerCase())}(?![a-z0-9])`).test(t)));
  }

  const TWO_LEVEL = new Set(['co.uk', 'org.uk', 'com.au', 'co.nz', 'co.jp', 'com.br', 'co.in']);
  function registeredDomain(host) {
    const parts = host.toLowerCase().replace(/^\.+|\.+$/g, '').split('.');
    if (parts.length >= 3 && TWO_LEVEL.has(parts.slice(-2).join('.'))) return parts.slice(-3).join('.');
    return parts.length >= 2 ? parts.slice(-2).join('.') : host;
  }

  function checkOwnership(sender, brand) {
    const name = brand.name;
    const out = { brand: name, status: 'UNVERIFIED', reason: '' };
    const set = (status, reason) => { out.status = status; out.reason = reason; return out; };

    if (sender.kind === 'short_code') {
      return brand.short_codes.includes(sender.short_code)
        ? set('CONFIRMED', `Short code ${sender.short_code} is a published ${name} short code.`)
        : set('UNVERIFIED', `Short code ${sender.short_code} is not in our list of known ${name} codes. Check the US Short Code Registry.`);
    }
    if (sender.kind === 'email') {
      const officials = new Set(brand.domains.map(registeredDomain));
      if (officials.has(registeredDomain(sender.domain))) return set('UNVERIFIED', `Sender email domain matches ${name}, but email senders are easily spoofed.`);
      if (sender.gateway) return set('CONTRADICTED', `${name} does not text via consumer email-to-SMS gateways (${sender.gateway}).`);
      return set('CONTRADICTED', `Sender is an email address (${sender.domain}), not a ${name} number or short code.`);
    }
    if (sender.kind === 'long_code') {
      if (brand.official_numbers.includes(sender.e164)) return set('CONFIRMED', `${sender.e164} is a published ${name} customer number.`);
      if (brand.sms_policy === 'never_initiates') return set('CONTRADICTED', `${name} does not initiate texts like this. ${brand.policy_text}`);
      if (sender.country !== 'US') return set('CONTRADICTED', `Sender is a non-US number (${sender.country || 'country unknown'}); ${name} messages US customers from US short codes.`);
      const lt = sender.line_type || '';
      if (lt === 'TOLL_FREE') return set('UNVERIFIED', `Toll-free number not on our ${name} list. Businesses do text from toll-free numbers, so verify on ${brand.domains[0]}.`);
      if (['MOBILE', 'FIXED_LINE_OR_MOBILE', 'FIXED_LINE', 'VOIP'].includes(lt)) return set('SUSPICIOUS', `${name} sends from short codes such as ${brand.short_codes.join(', ') || 'n/a'}, not from a regular 10-digit ${lt.replace(/_/g, ' ').toLowerCase()} line.`);
      return set('SUSPICIOUS', `Unexpected line type ${lt} for a ${name} message.`);
    }
    if (sender.kind === 'name') return set('UNVERIFIED', `Sender shows as the name "${sender.name}" with no number, so ${name} ownership cannot be checked. Real ${name} messages come from a short code, not a saved contact or alphanumeric sender.`);
    return set('UNVERIFIED', 'Could not parse the sender.');
  }

  // ---------------------------------------------------------------- urls
  const URL_RE = /\b((?:https?:\/\/|www\.)[^\s<>"']+|[a-z0-9-]+(?:\.[a-z0-9-]+)+\.[a-z]{2,}\/[^\s<>"']*|[a-z0-9-]+\.(?:com|net|org|info|top|xyz|club|vip|icu|cc|us|co|me|link|click|shop|online|site|live|app|cyou|cfd|sbs|buzz)(?:\/[^\s<>"']*)?)\b/gi;
  const SHORTENERS = new Set(['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'cutt.ly', 'rb.gy', 'shorturl.at', 'tiny.cc', 'rebrand.ly', 't.ly', 's.id', 'qrco.de']);
  const SUSPICIOUS_TLDS = new Set(['top', 'xyz', 'club', 'vip', 'icu', 'cc', 'cyou', 'cfd', 'sbs', 'buzz', 'click', 'link', 'live', 'online', 'site', 'shop', 'info', 'ru', 'cn', 'tk', 'ml', 'ga', 'gq', 'work', 'rest', 'lat', 'bond', 'win']);

  function similarity(a, b) { // quick ratio like difflib for short labels
    if (a === b) return 1;
    const longer = a.length >= b.length ? a : b, shorter = longer === a ? b : a;
    if (!longer.length) return 1;
    const dist = levenshtein(a, b);
    return (longer.length - dist) / longer.length;
  }
  function levenshtein(a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }

  function brandLookalike(host) {
    const rd = registeredDomain(host), label = rd.split('.')[0], flat = host.replace(/[-.]/g, '');
    for (const b of brands()) {
      const officials = new Set(b.domains.map(registeredDomain));
      if (officials.has(rd) || b.domains.map(d => d.toLowerCase()).includes(host)) return { lookalike: false, brand: b.name };
      const tokens = b.aliases.filter(a => a.trim().length >= 4).map(a => a.replace(/[ .-]/g, '').toLowerCase());
      tokens.push(b.name.toLowerCase().replace(/[ -]/g, ''));
      if (tokens.some(t => t && flat.includes(t))) return { lookalike: true, brand: b.name };
      for (const od of officials) if (similarity(label, od.split('.')[0]) >= 0.8) return { lookalike: true, brand: b.name };
    }
    return { lookalike: false, brand: null };
  }

  function analyzeUrls(text, claimed) {
    const results = [];
    for (const m of text.matchAll(URL_RE)) {
      const raw = m[1].replace(/[.,;:!?)]+$/, '');
      const url = /^https?:\/\//i.test(raw) ? raw : 'http://' + raw;
      let host;
      try { host = new URL(url).hostname.toLowerCase(); } catch (e) { continue; }
      if (!host) continue;
      const rd = registeredDomain(host), tld = rd.split('.').pop();
      const flags = []; let score = 0;

      if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) { flags.push('Link points to a bare IP address'); score += 3; }
      if (host.startsWith('xn--') || host.includes('.xn--')) { flags.push('Punycode / homoglyph domain'); score += 3; }
      if (SHORTENERS.has(rd)) { flags.push('URL shortener hides the real destination'); score += 2; }
      if (SUSPICIOUS_TLDS.has(tld)) { flags.push(`Suspicious top-level domain .${tld}`); score += 2; }
      const { lookalike, brand } = brandLookalike(host);
      const officialFor = lookalike ? null : brand;
      if (!/^https:\/\//i.test(raw) && !officialFor) { flags.push('Not HTTPS (or scheme omitted)'); score += 1; }
      if ((host.match(/-/g) || []).length >= 2 || host.length > 30) { flags.push('Long or hyphen-heavy hostname'); score += 1; }
      if (host.split('.').length >= 4) { flags.push('Deeply nested subdomain (brand name likely buried in a subdomain)'); score += 1; }
      if (lookalike) { flags.push(`Lookalike of ${brand}: domain mentions the brand but is not an official ${brand} domain`); score += 4; }
      else if (officialFor) { flags.push(`Official ${officialFor} domain`); score -= 2; }
      else if (claimed.length) { flags.push(`Message claims to be ${claimed.map(b => b.name).join(', ')} but link goes to unrelated domain ${rd}`); score += 3; }

      results.push({ url: raw, host, registered_domain: rd, flags, score: Math.max(score, 0), official_brand: officialFor });
    }
    return results;
  }

  // ---------------------------------------------------------------- content
  const CONTENT_PATTERNS = [
    [/\b(urgent|immediately|within \d+ (hours?|minutes?)|expires? (today|soon)|final (notice|warning)|last chance|act now|right away)\b/, 2, 'Urgency or deadline pressure'],
    [/\b(suspend(ed)?|locked|restricted|deactivat|on hold|frozen|closed)\b/, 2, 'Threat of account suspension or hold'],
    [/\b(verify|confirm|update|validate) (your )?(account|identity|information|details|payment|card|address)\b/, 2, 'Request to verify or update account details'],
    [/\b(unpaid|outstanding|overdue|owe|toll|fee|fine|penalty|late fee)\b/, 2, 'Claims you owe money'],
    [/\b(password|passcode|pin|ssn|social security|one[- ]time code|otp|security code)\b/, 3, 'Asks for credentials or one-time codes'],
    [/\b(gift ?card|bitcoin|crypto|wire transfer|zelle|western union|apple pay)\b/, 2, 'Unusual payment method'],
    [/\b(package|parcel|delivery|shipment|redeliver|reschedule)\b.*\b(address|fee|pay|confirm)\b/, 2, 'Package-delivery pretext'],
    [/reply\s+['"]?y['"]?(?![a-z])|reply\s+(yes|y)\b.*(reopen|exit|re-?open)|copy.*link.*safari|open.*in.*safari/, 3, 'Instructs you to reply Y or reopen the link (bypasses iMessage link blocking)'],
    [/\b(dear (customer|user|member|client)|valued customer)\b/, 1, 'Generic greeting instead of your name'],
    [/\b(you('ve| have) (won|been selected)|congratulations|claim your (prize|reward|refund))\b/, 2, 'Prize, reward, or refund bait'],
    [/\b(tax refund|rebate|stimulus|relief fund)\b/, 2, 'Government-money bait'],
    [/\b(wrong number|is this .{1,20}\?|hey stranger|long time)\b/, 3, 'Wrong-number opener (pig-butchering pattern)'],
  ];
  const PHONE_IN_TEXT = /(?:\+?1[\s.-]?)?\(?([2-9]\d{2})\)?[\s.-]?([2-9]\d{2})[\s.-]?(\d{4})\b/g;

  function analyzeContent(text, sender) {
    const low = text.toLowerCase();
    const hits = CONTENT_PATTERNS.filter(([re]) => re.test(low)).map(([, weight, signal]) => ({ signal, weight }));
    for (const m of text.matchAll(PHONE_IN_TEXT)) {
      const e164 = '+1' + m[1] + m[2] + m[3];
      if (e164 !== sender.e164) { hits.push({ signal: `Asks you to call a different number (${e164}) than the sender`, weight: 2 }); break; }
    }
    return hits;
  }

  // ---------------------------------------------------------------- scoring
  const OWNERSHIP_WEIGHT = { CONFIRMED: -4, UNVERIFIED: 1, SUSPICIOUS: 3, CONTRADICTED: 5 };

  function scoreReport(sender, ownership, urls, content) {
    let score = 0; const reasons = [];
    if (sender.kind === 'email') { score += 3; reasons.push('Sender is an email address, not a phone number' + (sender.gateway ? ` (${sender.gateway})` : '')); }
    if (sender.kind === 'long_code') {
      if (sender.valid === false) { score += 2; reasons.push('Sender number is not a valid phone number'); }
      if (sender.country !== 'US') { score += 2; reasons.push(`Sender is a non-US number (${sender.country || 'country unknown'})`); }
    }
    for (const o of ownership) { score += OWNERSHIP_WEIGHT[o.status]; reasons.push(`${o.brand} ownership ${o.status}: ${o.reason}`); }
    for (const u of urls) { score += u.score; u.flags.filter(f => !f.startsWith('Official')).forEach(f => reasons.push(`Link ${u.host}: ${f}`)); }
    for (const c of content) { score += c.weight; reasons.push(c.signal); }
    const level = score >= 7 ? 'Likely Scam' : score >= 3 ? 'Suspicious' : 'Safe';
    return { score, level, reasons };
  }

  const ACTIONS = {
    'Likely Scam': 'Do not tap the link or reply. Forward the text to 7726 (SPAM) and delete it. If it names a company you use, check your account through the official app only.',
    'Suspicious': 'Do not tap any link. Verify by contacting the company through its official app or website, not the number in the text.',
    'Safe': 'No action needed. If anything feels off, verify through the official app.',
  };

  // ---------------------------------------------------------------- entry
  function investigate(sender, text) {
    const senderInfo = classifySender(sender);
    const claimed = findClaimedBrands(text);
    const ownership = claimed.map(b => checkOwnership(senderInfo, b));
    const urls = analyzeUrls(text, claimed);
    const content = analyzeContent(text, senderInfo);
    const { score, level, reasons } = scoreReport(senderInfo, ownership, urls, content);
    return {
      input: { sender, text },
      sender: senderInfo,
      claimed_companies: claimed.map(b => b.name),
      company_ownership: ownership,
      urls,
      content_signals: content,
      offline_verdict: { score, risk_level: level, reasons },
      verdict_source: 'offline',
      risk_level: level,
      recommended_action: ACTIONS[level],
    };
  }

  const api = { investigate, parseThreadLog, classifySender, findClaimedBrands, checkOwnership, analyzeUrls, analyzeContent, scoreReport, registeredDomain };
  if (typeof module !== 'undefined') module.exports = api; else Object.assign(root, api);
})(typeof window !== 'undefined' ? window : globalThis);
