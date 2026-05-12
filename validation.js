function normalizeText(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function validateMeta(meta, { candidateKeywords, allowedCategories }) {
  if (!meta || typeof meta !== "object") {
    throw new Error("LLM result must be a JSON object");
  }

  const { tags, title, category } = meta;

  // ----------------------------
  // BASIC STRUCTURE CHECK
  // ----------------------------
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

  // ----------------------------
  // TAG VALIDATION
  // ----------------------------
  const keywordSet = new Set(
    candidateKeywords.map(k => k.toLowerCase())
  );

  const invalidTags = tags.filter(
    tag => !keywordSet.has(tag.toLowerCase())
  );

  if (invalidTags.length > 0) {
    throw new Error(
      `Tags not in candidate list: ${invalidTags.join(", ")}`
    );
  }

  // ----------------------------
  // CATEGORY VALIDATION
  // ----------------------------
  if (!allowedCategories.includes(category)) {
    throw new Error("Category is not in allowed categories list");
  }

  // ----------------------------
  // TITLE VALIDATION
  // ----------------------------
  if (typeof title !== "string" || !title.trim()) {
    throw new Error("Title must be a non-empty string");
  }

  const normalizedTitle = normalizeText(title);

  const titleTokens = new Set(
    normalizeText(title)
      .split(" ")
      .filter(Boolean)
  );

  const matchedTags = tags.filter(tag => {
    const tagTokens = normalizeText(tag)
      .split(" ")
      .filter(Boolean);

    return tagTokens.some(token =>
      titleTokens.has(token)
    );
  });

  if (matchedTags.length === 0) {
    throw new Error(
      "Title must contain semantic overlap with at least one tag"
    );
  }
}

module.exports = { validateMeta };