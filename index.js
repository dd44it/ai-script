const { loadKeywords } = require("./parser");
const { filterKeywords, calculateScore } = require("./keywords");
const { generateMeta } = require("./llm");
const { saveResult, cleanJsonResponse } = require("./utils");
const {
  saveSuccess,
  saveError
} = require("./logger");
const fs = require("fs");

function ensureDirs() {
  ["logs", "logs/success", "logs/errors"].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

async function run() {
  const prompt = process.argv.slice(2).join(" ");

  ensureDirs();
  const rawKeywords = loadKeywords("./keywords_clean_v2.ods");
  const filtered = filterKeywords(rawKeywords);

  const ranked = filtered
    .map(row => ({
      ...row,
      score: calculateScore(row, prompt)
    }))
    .sort((a, b) => b.score - a.score);

  // const top20 = ranked.slice(0, 20).map(x => x.Keyword);
  const top100 = ranked.slice(0, 100);
  const aiResult = await generateMeta(
    prompt,
    top100
  );

  // console.log(aiResult);
  try {
    const cleaned = cleanJsonResponse(aiResult);

    const parsed = JSON.parse(cleaned);

    // temp solution then we should add insert to db table
    saveResult(parsed);

    saveSuccess({
      prompt,
      result: parsed
    });

    console.log(parsed);
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