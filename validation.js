function validateMeta(meta, { candidateKeywords, allowedCategories }) {
  if (!meta || typeof meta !== "object") {
    throw new Error("LLM result must be a JSON object");
  }

  const { tags, title, category } = meta;

  if (!Array.isArray(tags)) {
    throw new Error("Result must contain tags array");
  }

  if (tags.length !== 20) {
    throw new Error("Result must contain exactly 20 tags");
  }

  if (new Set(tags).size !== tags.length) {
    throw new Error("Tags must be unique");
  }

  if (tags.some(tag => typeof tag !== "string" || !tag.trim())) {
    throw new Error("All tags must be non-empty strings");
  }

  const keywordSet = new Set(candidateKeywords.map(k => k.toLowerCase()));
  const invalidTags = tags.filter(tag => !keywordSet.has(tag.toLowerCase()));

  if (invalidTags.length > 0) {
    throw new Error(`Tags not in candidate list: ${invalidTags.join(", ")}`);
  }

  if (typeof title !== "string" || !title.trim()) {
    throw new Error("Title must be a non-empty string");
  }

  if (!allowedCategories.includes(category)) {
    throw new Error("Category is not in allowed categories list");
  }

  const lowerTitle = title.toLowerCase();
  const keywordsInTitle = tags.filter(tag =>
    lowerTitle.includes(tag.toLowerCase())
  );

  if (keywordsInTitle.length < 1 || keywordsInTitle.length > 2) {
    throw new Error("Title must include 1-2 selected keywords");
  }
}

module.exports = { validateMeta };
