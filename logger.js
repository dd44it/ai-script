const fs = require("fs");
const path = require("path");

function getTimestamp() {
  return new Date().toISOString();
}

function saveSuccess({ prompt, result }) {
  const fileName = `${Date.now()}.json`;

  const data = {
    prompt,
    result,
    timestamp: getTimestamp()
  };

  fs.writeFileSync(
    path.join("logs", "success", fileName),
    JSON.stringify(data, null, 2)
  );
}

function saveError({ prompt, error }) {
  const fileName = `${Date.now()}.json`;

  const data = {
    prompt,
    error: error?.message || String(error),
    timestamp: getTimestamp()
  };

  fs.writeFileSync(
    path.join("logs", "errors", fileName),
    JSON.stringify(data, null, 2)
  );
}

module.exports = {
  saveSuccess,
  saveError
};