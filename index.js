const { loadKeywords } = require("./parser");
const { filterKeywords, calculateScore } = require("./keywords");
const { generateMeta } = require("./llm");
const { cleanJsonResponse } = require("./utils");
const { validateMeta } = require("./validation");
const { ALLOWED_CATEGORIES } = require("./constants");
const {
  saveSuccess,
  saveError
} = require("./logger");
const fs = require("fs");
const { initDB, saveToDB } = require("./db");

function ensureDirs() {
  ["logs", "logs/success", "logs/errors"].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

async function run() {
  const prompt = process.argv.slice(2).join(" ").trim();

  if (!prompt) {
    console.log("ERROR: prompt is required");
    process.exitCode = 1;
    return;
  }

  ensureDirs();
  const rawKeywords = loadKeywords("./keywords_clean_v2.ods");
  const filtered = filterKeywords(rawKeywords);
  initDB();

  const ranked = filtered
    .map(row => ({
      ...row,
      score: calculateScore(row, prompt)
    }))
    .sort((a, b) => b.score - a.score);

  const top100 = ranked.slice(0, 100);
  try {
    const aiResult = await generateMeta(
      prompt,
      top100
    );

    const cleaned = cleanJsonResponse(aiResult);

    const parsed = JSON.parse(cleaned);
    validateMeta(parsed, {
      candidateKeywords: top100.map(k => k.Keyword),
      allowedCategories: ALLOWED_CATEGORIES
    });

    saveSuccess({
      prompt,
      result: parsed
    });

    await saveToDB({
      prompt,
      title: parsed.title,
      category: parsed.category,
      tags: parsed.tags
    });
  }
  catch (error) {
    saveError({
      prompt,
      error
    });

    console.log("ERROR:", error.message);
  }
}

run();
