const CONFIG = {
  LIMITS: {
    MAX_KEYWORDS_TO_LLM: 30,
    MAX_GENERIC_TAGS: 4
  },

  WEIGHTS: {
    MATCH: 15,
    VOLUME: 0.15,
    TRAFFIC: 0.1,
    KD: 0.1,
    SPECIFICITY_BONUS: 5,
    GENERIC_PENALTY: 15,
    JUNK_PENALTY: 40
  },

  BLOCKED: [
    "kling",
    "pixai",
    "runway",
    "openart",

  ],

  GENERIC_WORDS: [
    "ai",
    "generator",
    "video",
    "free",
    "online",
    "tool",
    "editor"
  ],

  JUNK_PATTERNS: [
    "text to",
    "face swap",
    "background",
    "editor",
    "generator"
  ]
};

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .trim();
}

function filterKeywords(list) {
  return list.filter(row => {
    if (!row.Keyword) return false;

    const text = normalize(row.Keyword);

    return !CONFIG.BLOCKED.some(b =>
      text.includes(b)
    );
  });
}

function calculateScore(row, prompt) {
  const text = normalize(row.Keyword);

  const tokens = normalize(prompt)
    .split(/\s+/)
    .filter(Boolean);

  let matchScore = 0;

  for (const token of tokens) {
    if (text.includes(token)) {
      matchScore += 1;
    }
  }

  // semantic relevance first
  const semanticScore =
    matchScore * CONFIG.WEIGHTS.MATCH;

  // SEO metrics reduced intentionally
  const volumeScore =
    Math.log10(Number(row.Volume || 1))
    * CONFIG.WEIGHTS.VOLUME;

  const trafficScore =
    Math.log10(Number(row.OrganicTraffic || 1))
    * CONFIG.WEIGHTS.TRAFFIC;

  const kdScore =
    (100 - Number(row.KD || 0))
    * CONFIG.WEIGHTS.KD;

  // longer keywords usually more specific
  const specificityBonus =
    text.length > 18
      ? CONFIG.WEIGHTS.SPECIFICITY_BONUS
      : 0;

  // generic penalties
  let penalty = 0;

  for (const word of CONFIG.GENERIC_WORDS) {
    if (text.includes(word)) {
      penalty += CONFIG.WEIGHTS.GENERIC_PENALTY;
    }
  }

  // heavy ecosystem junk penalty
  for (const junk of CONFIG.JUNK_PATTERNS) {
    if (text.includes(junk)) {
      penalty += CONFIG.WEIGHTS.JUNK_PENALTY;
    }
  }

  return (
    semanticScore +
    volumeScore +
    trafficScore +
    kdScore +
    specificityBonus -
    penalty
  );
}

module.exports = {
  filterKeywords,
  calculateScore,
  CONFIG
};