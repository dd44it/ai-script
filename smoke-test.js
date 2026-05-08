const assert = require("assert");
const { calculateScore } = require("./keywords");
const { validateMeta } = require("./validation");
const { ALLOWED_CATEGORIES } = require("./constants");

function runSmokeTests() {
  const row = {
    Keyword: "video ai editor",
    Volume: 100,
    OrganicTraffic: 50,
    KD: 20
  };

  const scoreEmpty = calculateScore(row, "");
  const scoreMatched = calculateScore(row, "video");
  assert(scoreMatched > scoreEmpty, "matched prompt should increase score");

  const validMeta = {
    tags: Array.from({ length: 20 }, (_, i) => `kw-${i + 1}`),
    title: "Best kw-1 tools for creators",
    category: ALLOWED_CATEGORIES[0]
  };

  const candidateKeywords = validMeta.tags;
  validateMeta(validMeta, { candidateKeywords, allowedCategories: ALLOWED_CATEGORIES });

  assert.throws(
    () => {
      validateMeta(
        { ...validMeta, tags: validMeta.tags.slice(0, 19) },
        { candidateKeywords, allowedCategories: ALLOWED_CATEGORIES }
      );
    },
    /exactly 20 tags/
  );

  console.log("Smoke tests passed");
}

runSmokeTests();
