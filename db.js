const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "database.sqlite")
);

function initDB() {
  db.run(`
    CREATE TABLE IF NOT EXISTS ai_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prompt TEXT,
      title TEXT,
      category TEXT,
      tags TEXT,
      created_at TEXT
    )
  `);
}

function saveToDB({ prompt, title, category, tags }) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO ai_results
      (prompt, title, category, tags, created_at)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        prompt,
        title,
        category,
        JSON.stringify(tags),
        new Date().toISOString()
      ],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

module.exports = {
  db,
  initDB,
  saveToDB
};