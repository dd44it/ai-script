const fs = require("fs");

function cleanJsonResponse(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

module.exports = { cleanJsonResponse };