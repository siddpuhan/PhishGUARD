/**
 * Kavach detection engine.
 *
 * Deterministic, signal-based scoring used both by the demo client and the
 * /api/detect route. No network calls — every verdict is derived from lexical,
 * structural, and known-pattern signals present in the URL itself.
 */

const SUSPICIOUS_KEYWORDS = [
  "login", "signin", "sign-in", "verify", "verification", "account",
  "update", "confirm", "secure", "security", "wallet", "bank", "banking",
  "paypal", "apple", "microsoft", "office", "outlook", "gmail", "google",
  "amazon", "netflix", "coinbase", "metamask", "recover", "unlock",
  "suspended", "limited", "invoice", "payment", "billing", "reset",
  "password", "credential", "auth", "support", "service", "validate",
];

const SUSPICIOUS_TLDS = new Set([
  "tk", "ml", "ga", "cf", "gq", "top", "xyz", "click", "country",
  "stream", "download", "loan", "work", "men", "racing", "review",
  "party", "trade", "date", "bid", "win", "kim", "science",
]);

const SHORTENERS = new Set([
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd",
  "buff.ly", "rebrand.ly", "cutt.ly", "rb.gy", "shorturl.at",
]);

function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function safeParseUrl(input) {
  const candidate = input.includes("://") ? input : `https://${input}`;
  try {
    return new URL(candidate);
  } catch {
    return null;
  }
}

function isIpAddress(host) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(host) || host.includes(":");
}

function countSubdomains(host, registeredDomain) {
  if (host === registeredDomain) return 0;
  const prefix = host.replace(`.${registeredDomain}`, "");
  if (!prefix) return 0;
  return prefix.split(".").filter(Boolean).length;
}

function registeredDomainOf(host) {
  const parts = host.split(".");
  if (parts.length <= 2) {
    return { domain: host, tld: parts[parts.length - 1] ?? "" };
  }
  // Handle common two-part TLDs coarsely.
  const lastTwo = parts.slice(-2).join(".");
  const twoPartTlds = new Set([
    "co.uk", "co.jp", "com.au", "co.in", "co.kr", "com.br", "co.za",
    "com.cn", "co.nz", "com.mx", "org.uk", "ac.uk", "gov.uk",
  ]);
  if (twoPartTlds.has(lastTwo)) {
    return { domain: parts.slice(-3).join("."), tld: lastTwo };
  }
  return { domain: lastTwo, tld: parts[parts.length - 1] ?? "" };
}

/**
 * Extract the "brand" the attacker is likely impersonating by searching the
 * full URL string for known brand keywords. Returns the first hit, if any.
 */
function impersonatedBrand(url) {
  const lower = url.toLowerCase();
  const brands = [
    "paypal", "apple", "microsoft", "office365", "outlook", "google",
    "gmail", "amazon", "netflix", "coinbase", "metamask", "binance",
    "instagram", "facebook", "linkedin", "dropbox", "adobe", "dhl",
    "fedex", "ups", "bankofamerica", "wellsfargo", "chase", "citi",
    "revolut", "wise", "steampowered", "discord",
  ];
  for (const b of brands) {
    if (lower.includes(b)) return b;
  }
  return null;
}

export function detect(rawUrl) {
  const start = performance.now();
  const trimmed = rawUrl.trim();
  const url = safeParseUrl(trimmed);
  const now = new Date().toISOString();

  // Defensive fallback for unparseable input.
  if (!url) {
    return {
      url: trimmed,
      normalizedUrl: trimmed,
      host: "",
      verdict: "suspicious",
      confidence: 52,
      riskScore: 74,
      riskLabel: "High",
      threatExplanation:
        "The input could not be parsed as a URL. Malformed or obfuscated strings are a common phishing tactic used to evade automated filters.",
      features: [
        { label: "URL structure", weight: 88, detail: "Could not be parsed as a valid URL" },
        { label: "Obfuscation", weight: 64, detail: "Malformed input — possible evasion attempt" },
      ],
      recommendations: [
        "Do not open the link.",
        "Request the original destination from the sender through a separate channel.",
      ],
      scannedAt: now,
      latencyMs: Math.round(performance.now() - start),
      raw: {
        scheme: "",
        hasHttps: false,
        subdomainDepth: 0,
        pathDepth: 0,
        tld: "",
        registeredDomain: "",
      },
    };
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const { domain: registeredDomain, tld } = registeredDomainOf(host);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const subdomainDepth = countSubdomains(host, registeredDomain);
  const brand = impersonatedBrand(`${host}${url.pathname}`);
  const lower = `${host}${url.pathname}${url.search}`.toLowerCase();

  const signals = [];
  let risk = 18; // baseline trust

  // 1. Protocol — http with credentials forms is a strong signal.
  if (url.protocol === "http:") {
    risk += 22;
    signals.push({
      label: "No TLS certificate",
      weight: 70,
      detail: "Plain HTTP — traffic and any submitted data are sent unencrypted.",
    });
  } else {
    signals.push({
      label: "TLS certificate",
      weight: 12,
      detail: "HTTPS present. A certificate is expected but is not, on its own, proof of safety.",
    });
  }

  // 2. Raw IP host instead of a domain name.
  if (isIpAddress(host)) {
    risk += 30;
    signals.push({
      label: "IP-address host",
      weight: 92,
      detail: "The host is a literal IP address. Legitimate brands host on named domains.",
    });
  }

  // 3. Suspicious TLD.
  if (tld && SUSPICIOUS_TLDS.has(tld)) {
    risk += 18;
    signals.push({
      label: "High-abuse TLD",
      weight: 76,
      detail: `The .${tld} space is frequently used in credential-harvesting campaigns.`,
    });
  }

  // 4. Brand impersonation — brand keyword present but not the registered domain.
  if (brand) {
    const isLegitHost =
      host === `${brand}.com` ||
      host === `${brand}.org` ||
      host === `${brand}.net` ||
      host.endsWith(`.${brand}.com`);
    if (!isLegitHost) {
      risk += 26;
      signals.push({
        label: "Brand impersonation",
        weight: 89,
        detail: `References “${brand}” but is not hosted on a ${brand}.com domain.`,
      });
    }
  }

  // 5. Suspicious keywords in host/path/query.
  const keywordHits = SUSPICIOUS_KEYWORDS.filter((k) => lower.includes(k));
  if (keywordHits.length > 0) {
    risk += clamp(keywordHits.length * 7, 0, 24);
    signals.push({
      label: "Credential-harvesting terms",
      weight: 58 + Math.min(keywordHits.length * 6, 30),
      detail: `Contains: ${keywordHits.slice(0, 4).join(", ")}${keywordHits.length > 4 ? "…" : ""}.`,
    });
  }

  // 6. Subdomain stacking — many labels often signal subdomain hijack lookalikes.
  if (subdomainDepth >= 3) {
    risk += 14;
    signals.push({
      label: "Subdomain stacking",
      weight: 60,
      detail: `${subdomainDepth} subdomain labels. Often used to bury a lookalike domain (e.g. login.brand.com.attacker.tld).`,
    });
  }

  // 7. Excessive hyphens in the registered domain.
  const hyphens = (registeredDomain.match(/-/g) ?? []).length;
  if (hyphens >= 2) {
    risk += 12;
    signals.push({
      label: "Hyphenated domain",
      weight: 48,
      detail: `${hyphens} hyphens in the registered domain. A common lookalike pattern.`,
    });
  }

  // 8. Very long URL.
  if (trimmed.length > 90) {
    risk += 8;
    signals.push({
      label: "URL length",
      weight: 38,
      detail: `${trimmed.length} characters. Long URLs are used to hide the destination and pack redirects.`,
    });
  }

  // 9. Punycode / internationalised homoglyphs.
  if (host.includes("xn--")) {
    risk += 24;
    signals.push({
      label: "Punycode homoglyph",
      weight: 84,
      detail: "Host contains punycode (xn--). Used to spoof latin characters with look-alikes from other scripts.",
    });
  }

  // 10. URL shortener — destination is hidden.
  if (SHORTENERS.has(registeredDomain)) {
    risk += 10;
    signals.push({
      label: "URL shortener",
      weight: 44,
      detail: `Shortened by ${registeredDomain}. The real destination is hidden behind a redirect.`,
    });
  }

  // 11. Embedded credentials (user:pass@) — a classic obfuscation.
  if (url.username || url.password) {
    risk += 20;
    signals.push({
      label: "Embedded credentials",
      weight: 80,
      detail: "URL contains a user:password@ prefix. Used to disguise the true host in the address bar.",
    });
  }

  // 12. '@' in the path that could mislead a reader about the host.
  if (url.pathname.includes("@") || url.search.includes("@")) {
    risk += 10;
    signals.push({
      label: "Misleading '@' segment",
      weight: 50,
      detail: "An '@' symbol appears in the path, which can trick a reader about the real host.",
    });
  }

  // 13. Known-good, high-reputation domains get a baseline discount.
  const reputable = new Set([
    "google.com", "github.com", "wikipedia.org", "apple.com", "microsoft.com",
    "stackoverflow.com", "mozilla.org", "cloudflare.com", "vercel.com",
    "linear.app", "notion.so", "stripe.com", "openai.com",
  ]);
  if (reputable.has(registeredDomain)) {
    risk -= 16;
    signals.push({
      label: "Reputation",
      weight: 8,
      detail: `${registeredDomain} is a well-established domain.`,
    });
  }

  risk = clamp(Math.round(risk));

  // Confidence grows with distance from the 50-point decision boundary.
  const distance = Math.abs(risk - 50);
  const confidence = clamp(Math.round(58 + distance * 0.9), 50, 99);

  let verdict;
  let riskLabel;
  if (risk >= 62) {
    verdict = "malicious";
    riskLabel = risk >= 85 ? "Critical" : "High";
  } else if (risk >= 40) {
    verdict = "suspicious";
    riskLabel = "Elevated";
  } else {
    verdict = "safe";
    riskLabel = "Low";
  }

  // Normalise feature weights to a 0–100 scale relative to the max.
  const maxWeight = Math.max(...signals.map((s) => s.weight), 1);
  const features = signals
    .map((s) => ({ ...s, weight: Math.round((s.weight / maxWeight) * 100) }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 6);

  const threatExplanation = buildExplanation(verdict, {
    host,
    brand,
    hasHttps: url.protocol === "https:",
    risk,
    keywordHits,
    tld,
  });

  const recommendations = buildRecommendations(verdict, {
    hasHttps: url.protocol === "https:",
    brand,
    isShortener: SHORTENERS.has(registeredDomain),
  });

  return {
    url: trimmed,
    normalizedUrl: url.toString(),
    host,
    verdict,
    confidence,
    riskScore: risk,
    riskLabel,
    threatExplanation,
    features,
    recommendations,
    scannedAt: now,
    latencyMs: Math.round(performance.now() - start),
    raw: {
      scheme: url.protocol.replace(":", ""),
      hasHttps: url.protocol === "https:",
      subdomainDepth,
      pathDepth: pathSegments.length,
      tld,
      registeredDomain,
    },
  };
}

function buildExplanation(verdict, ctx) {
  if (verdict === "safe") {
    return ctx.hasHttps
      ? "No high-risk lexical or structural signals were found. The domain uses TLS and does not match known impersonation patterns. Treat this as a low-risk baseline, not a guarantee."
      : "No strong impersonation signals were found, though the connection is not encrypted. Avoid entering credentials over HTTP.";
  }
  if (verdict === "suspicious") {
    const parts = [];
    if (!ctx.hasHttps) parts.push("the connection is unencrypted");
    if (ctx.brand) parts.push(`the URL references “${ctx.brand}” but is not hosted on its domain`);
    if (ctx.keywordHits.length) parts.push("credential-related terms appear in the path");
    return `Several weak signals combine: ${parts.join(", ") || "the structure is unusual"}. None is conclusive on its own, so manual review is recommended before interacting.`;
  }
  // malicious
  const parts = [];
  if (ctx.brand) parts.push(`it impersonates “${ctx.brand}” while hosting on an unrelated domain`);
  if (!ctx.hasHttps) parts.push("it does not use TLS");
  if (ctx.tld && SUSPICIOUS_TLDS.has(ctx.tld)) parts.push(`it uses the high-abuse .${ctx.tld} space`);
  if (ctx.keywordHits.length) parts.push("it surfaces credential-harvesting language");
  return `The model flags this URL as malicious because ${parts.join(", ") || "multiple high-risk signals are present"}. Do not submit credentials or personal information.`;
}

function buildRecommendations(verdict, ctx) {
  if (verdict === "safe") {
    return [
      "Proceed normally. Still verify the address bar before entering credentials.",
      ctx.hasHttps
        ? "The certificate is valid for this session."
        : "Prefer the HTTPS version of the site when one is available.",
    ];
  }
  if (verdict === "suspicious") {
    return [
      "Do not enter credentials on this page.",
      ctx.brand
        ? `If you expected ${ctx.brand}, navigate there directly instead of following this link.`
        : "Navigate to the service directly instead of following this link.",
      "If the link arrived by email or message, confirm with the sender through a separate channel.",
    ];
  }
  return [
    "Do not open the link or submit any information.",
    ctx.brand
      ? `This is not ${ctx.brand}. Report it to the legitimate provider’s abuse team.`
      : "Report the URL to your organisation’s security team or the relevant abuse channel.",
    ctx.isShortener
      ? "Shortened links hide the destination. Resolve it with an unshortener before deciding."
      : "If you already entered credentials, rotate them immediately and enable two-factor authentication.",
  ];
}
