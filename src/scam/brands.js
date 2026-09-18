// GENERATED from brands.json (python3 src/scam/build_brands_js.py). Do not edit by hand.
const BRANDS = [
  {
    "name": "USPS",
    "aliases": [
      "usps",
      "us postal",
      "u.s. postal",
      "postal service",
      "united states postal"
    ],
    "domains": [
      "usps.com",
      "usps.gov",
      "informeddelivery.usps.com",
      "tools.usps.com"
    ],
    "short_codes": [
      "28777"
    ],
    "official_numbers": [
      "+18002758777"
    ],
    "sms_policy": "never_initiates",
    "policy_text": "USPS does not send unsolicited texts with tracking links. It only texts if you requested tracking updates, and never asks for payment or personal info by text."
  },
  {
    "name": "UPS",
    "aliases": [
      "ups",
      "united parcel"
    ],
    "domains": [
      "ups.com"
    ],
    "short_codes": [
      "69877",
      "94601"
    ],
    "official_numbers": [
      "+18007425877"
    ],
    "sms_policy": "uses_short_codes",
    "policy_text": "UPS sends delivery texts from short codes such as 69877 (MYUPS) and does not request payment via text link."
  },
  {
    "name": "FedEx",
    "aliases": [
      "fedex",
      "fed ex",
      "federal express"
    ],
    "domains": [
      "fedex.com"
    ],
    "short_codes": [
      "46339"
    ],
    "official_numbers": [
      "+18004633339"
    ],
    "sms_policy": "uses_short_codes",
    "policy_text": "FedEx texts from short code 46339 (FEDEX) and does not ask for payment or personal info by text link."
  },
  {
    "name": "Amazon",
    "aliases": [
      "amazon",
      "amazon prime",
      "prime membership"
    ],
    "domains": [
      "amazon.com",
      "amazon.ca",
      "amazon.co.uk",
      "amazon.de",
      "primevideo.com"
    ],
    "short_codes": [
      "262966",
      "27287"
    ],
    "official_numbers": [
      "+18882802331"
    ],
    "sms_policy": "uses_short_codes",
    "policy_text": "Amazon sends verification codes and order alerts from short codes such as 262966 (AMAZON). Links go only to amazon.com."
  },
  {
    "name": "Apple",
    "aliases": [
      "apple",
      "icloud",
      "apple id",
      "app store",
      "apple pay"
    ],
    "domains": [
      "apple.com",
      "icloud.com",
      "appleid.apple.com"
    ],
    "short_codes": [],
    "official_numbers": [
      "+18002752273"
    ],
    "sms_policy": "never_initiates",
    "policy_text": "Apple does not text about suspended iCloud accounts or ask you to verify via link. Codes arrive on-device or from a short code you triggered."
  },
  {
    "name": "Chase",
    "aliases": [
      "chase",
      "chase bank",
      "jpmorgan",
      "jp morgan"
    ],
    "domains": [
      "chase.com",
      "jpmorganchase.com",
      "jpmorgan.com"
    ],
    "short_codes": [
      "24273",
      "28107",
      "72166",
      "36640"
    ],
    "official_numbers": [
      "+18009359935"
    ],
    "sms_policy": "uses_short_codes",
    "policy_text": "Chase fraud and account alerts come from short codes such as 24273 (CHASE) and 72166. Chase never asks for your password or full card number by text."
  },
  {
    "name": "Bank of America",
    "aliases": [
      "bank of america",
      "bofa",
      "bankofamerica",
      "boa "
    ],
    "domains": [
      "bankofamerica.com",
      "bofa.com"
    ],
    "short_codes": [
      "322632",
      "73981"
    ],
    "official_numbers": [
      "+18004321000"
    ],
    "sms_policy": "uses_short_codes",
    "policy_text": "Bank of America alerts come from short codes such as 322632. It never asks you to move money or share codes by text."
  },
  {
    "name": "Wells Fargo",
    "aliases": [
      "wells fargo",
      "wellsfargo",
      "wells"
    ],
    "domains": [
      "wellsfargo.com",
      "wf.com"
    ],
    "short_codes": [
      "93557",
      "93733",
      "93729"
    ],
    "official_numbers": [
      "+18008693557"
    ],
    "sms_policy": "uses_short_codes",
    "policy_text": "Wells Fargo alerts come from short codes such as 93557 (WELLS) and 93733. It never asks for access codes by text."
  },
  {
    "name": "PayPal",
    "aliases": [
      "paypal",
      "pay pal"
    ],
    "domains": [
      "paypal.com",
      "paypal.me"
    ],
    "short_codes": [
      "729725"
    ],
    "official_numbers": [
      "+18882211161"
    ],
    "sms_policy": "uses_short_codes",
    "policy_text": "PayPal texts from short code 729725 (PAYPAL). Links go only to paypal.com."
  },
  {
    "name": "Venmo",
    "aliases": [
      "venmo"
    ],
    "domains": [
      "venmo.com"
    ],
    "short_codes": [
      "86753"
    ],
    "official_numbers": [
      "+18554812506"
    ],
    "sms_policy": "uses_short_codes",
    "policy_text": "Venmo texts from short code 86753 (VENMO) and never asks for your password or a code by reply."
  },
  {
    "name": "Netflix",
    "aliases": [
      "netflix"
    ],
    "domains": [
      "netflix.com"
    ],
    "short_codes": [],
    "official_numbers": [
      "+18665797172"
    ],
    "sms_policy": "never_initiates",
    "policy_text": "Netflix does not text about failed payments with links. Billing issues appear inside the app or at netflix.com."
  },
  {
    "name": "E-ZPass",
    "aliases": [
      "e-zpass",
      "ezpass",
      "ez pass",
      "e-z pass",
      "toll",
      "tolls",
      "sunpass",
      "fastrak",
      "peach pass",
      "ipass",
      "i-pass",
      "txtag",
      "turnpike"
    ],
    "domains": [
      "e-zpassny.com",
      "ezpass.com",
      "e-zpassiag.com",
      "ezpassnj.com",
      "ezpassmd.com",
      "ezpassva.com",
      "paturnpike.com",
      "sunpass.com",
      "bayareafastrak.org",
      "thetollroads.com",
      "txtag.org",
      "peachpass.com",
      "getipass.com"
    ],
    "short_codes": [],
    "official_numbers": [],
    "sms_policy": "never_initiates",
    "policy_text": "E-ZPass and other US toll agencies do not send text messages requesting payment. Unpaid-toll texts with links are a known nationwide scam (FBI IC3 alert)."
  },
  {
    "name": "IRS",
    "aliases": [
      "irs",
      "internal revenue",
      "tax refund",
      "tax rebate"
    ],
    "domains": [
      "irs.gov"
    ],
    "short_codes": [],
    "official_numbers": [
      "+18008291040"
    ],
    "sms_policy": "never_initiates",
    "policy_text": "The IRS does not initiate contact by text message. Any text about a refund, rebate, or tax bill is fraudulent."
  },
  {
    "name": "Social Security Administration",
    "aliases": [
      "social security",
      "ssa",
      "ssn suspended"
    ],
    "domains": [
      "ssa.gov"
    ],
    "short_codes": [],
    "official_numbers": [
      "+18007721213"
    ],
    "sms_policy": "never_initiates",
    "policy_text": "SSA does not text about suspended Social Security numbers or ask for payment."
  },
  {
    "name": "DMV",
    "aliases": [
      "dmv",
      "department of motor vehicles",
      "motor vehicles",
      "driver's license",
      "drivers license"
    ],
    "domains": [
      "dmv.ca.gov",
      "dmv.ny.gov",
      "dmv.org",
      "txdmv.gov",
      "flhsmv.gov"
    ],
    "short_codes": [],
    "official_numbers": [],
    "sms_policy": "never_initiates",
    "policy_text": "State DMVs do not text about unpaid tickets or license suspension with payment links. This is a known 2025-2026 scam wave."
  },
  {
    "name": "Verizon",
    "aliases": [
      "verizon",
      "vzw"
    ],
    "domains": [
      "verizon.com",
      "verizonwireless.com",
      "vzw.com"
    ],
    "short_codes": [
      "899000",
      "89900"
    ],
    "official_numbers": [
      "+18009220204"
    ],
    "sms_policy": "uses_short_codes",
    "policy_text": "Verizon account texts come from short codes such as 899000. Verizon does not send reward or refund links by text."
  },
  {
    "name": "AT&T",
    "aliases": [
      "at&t",
      "att ",
      "at and t"
    ],
    "domains": [
      "att.com",
      "att.net"
    ],
    "short_codes": [
      "7726",
      "9287"
    ],
    "official_numbers": [
      "+18003310500"
    ],
    "sms_policy": "uses_short_codes",
    "policy_text": "AT&T account texts come from short codes. AT&T does not send bill-credit or reward links from 10-digit numbers."
  },
  {
    "name": "T-Mobile",
    "aliases": [
      "t-mobile",
      "tmobile",
      "t mobile"
    ],
    "domains": [
      "t-mobile.com"
    ],
    "short_codes": [
      "456",
      "3456"
    ],
    "official_numbers": [
      "+18009378997"
    ],
    "sms_policy": "uses_short_codes",
    "policy_text": "T-Mobile texts from short codes such as 456. It does not send gift or refund links from 10-digit numbers."
  },
  {
    "name": "Coinbase",
    "aliases": [
      "coinbase"
    ],
    "domains": [
      "coinbase.com"
    ],
    "short_codes": [
      "25742"
    ],
    "official_numbers": [
      "+18889087930"
    ],
    "sms_policy": "uses_short_codes",
    "policy_text": "Coinbase sends 2FA codes from short code 25742 and never asks you to move funds or share codes by text."
  },
  {
    "name": "Microsoft",
    "aliases": [
      "microsoft",
      "outlook",
      "office 365",
      "xbox"
    ],
    "domains": [
      "microsoft.com",
      "live.com",
      "outlook.com",
      "office.com",
      "xbox.com"
    ],
    "short_codes": [
      "51789"
    ],
    "official_numbers": [
      "+18006427676"
    ],
    "sms_policy": "uses_short_codes",
    "policy_text": "Microsoft account codes come from short code 51789. Microsoft does not text about locked accounts with links."
  }
];
if (typeof module !== 'undefined') module.exports = { BRANDS };
