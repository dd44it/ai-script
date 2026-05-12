require("dotenv").config();

const {
  GoogleGenerativeAI
} = require("@google/generative-ai");

const {
  ALLOWED_CATEGORIES
} = require("./constants");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

function formatKeywords(list) {
  return list
    .map(
      k =>
        `- ${k.Keyword} | relevance=${k.score}`
    )
    .join("\n");
}

async function generateMeta(prompt, keywords) {
  const topKeywords = keywords.slice(0, 30);

  const specific = topKeywords.filter(
    k => k.score >= 20
  );

  const generic = topKeywords.filter(
    k => k.score < 20
  );

  const input = `
You are an expert taxonomy and SEO tagging system for an AI video platform.

Your task is semantic tagging based on VISUAL CONTENT of the prompt.

==================================================
USER PROMPT
==================================================
${prompt}

==================================================
HIGH PRIORITY VISUAL KEYWORDS
==================================================
${formatKeywords(specific)}

==================================================
LOW PRIORITY FALLBACK KEYWORDS
==================================================
${formatKeywords(generic)}

==================================================
AVAILABLE CATEGORIES
==================================================
${ALLOWED_CATEGORIES.join("\n")}

## Core Rules

### 1. Content specificity comes first
Always analyze the prompt for specific elements before selecting tags:
- Characters, creatures, or objects → find keywords matching them
- Camera movement or technique → find keywords matching the motion
- Mood, style, or atmosphere → find keywords matching the aesthetic
- Platform or tool mentioned → include it as a tag

Generic tags like "ai video generator", "online video editor", "video editing" are LAST resort fillers, not primary tags.

### 2. Tag selection hierarchy
Follow this order strictly:
1. Keywords specific to the subject/action/style in the prompt
2. Keywords specific to the technique or camera work
3. Keywords referencing a specific tool or model (if mentioned)
4. Maximum 3–4 generic high-volume tags to round out coverage

### 3. Limit generic tags per card
These tags are considered generic and interchangeable:
"ai video generator", "text to video ai", "free ai video generator", "ai video editor", "video editing", "ai art", "online video editor", "ai generator", "video ai"

Use no more than 3–4 of these per prompt. The remaining 16–17 tags must be specific to the actual content.

### 4. No tag repetition across cards
If a generic tag was used in the previous card, replace it with a synonym from the database in the next one. Rotate through available variants:
- Instead of "ai video generator" → try "ai video creation", "ai video tool", "generate video from text", "ai video clip generator"
- Instead of "text to video ai" → try "text to video generator", "text to video free"
- Instead of "ai art" → try "ai generated art", "ai art generator", "ai visual art platform"

### 5. All tags must come from the provided keyword database
Never invent tags. If a highly specific keyword (e.g. "goggles reflection video") does not exist in the database, find the closest match that still reflects the content. Do not substitute with a generic tag just because the specific one is missing.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON:

{
  "prompt": "${prompt}",
  "title": "",
  "category": "",
  "tags": []
}
`;

  try {
    const result = await model.generateContent(input);

    return result.response.text();
  }
  catch (err) {
    throw new Error(
      `LLM generation failed: ${err.message}`
    );
  }
}

module.exports = {
  generateMeta
};