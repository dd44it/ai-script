const fs = require("fs");

function saveResult(data) {
  fs.writeFileSync(
    "./result.json",
    JSON.stringify(data, null, 2)
  );
}

function cleanJsonResponse(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

module.exports = { saveResult, cleanJsonResponse };