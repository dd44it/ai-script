require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

async function generateMeta(prompt, keywords) {
  const keywordList = keywords
    .map(k => k.Keyword)
    .join(", ");

  const input = `
    User prompt:
    "${prompt}"
    
    Candidate keywords:
    ${keywordList}
    
    Available categories:
    - Ads / Marketing
    - Product / Demo
    - Brand / Corporate
    - Presentation / Pitch
    - Social Content
    - Education / Explainers
    - Film / Series
    - Experimental / Showcase
    - E-commerce / Retail
    - Event / Promo
    
    Tasks:
    1. Select TOP 20 most relevant keywords
    2. Generate SEO title using 1-2 keywords
    3. Choose ONE category from the list
    
    STRICT RULES:
    - Use ONLY keywords from candidate list
    - DO NOT invent keywords
    - DO NOT use unrelated keywords
    - DO NOT use multilingual keywords unless prompt language matches
    - Prefer semantically relevant keywords
    - Avoid generic AI keywords if more specific exist
    - Return ONLY valid JSON
    - No markdown
    - No explanations
    
    JSON format:
    {
      "tags": [],
      "title": "",
      "category": ""
    }
`;

  const result = await model.generateContent(input);

  return result.response.text();
}

module.exports = { generateMeta };