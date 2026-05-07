const XLSX = require("xlsx");

function loadKeywords(path) {
  const workbook = XLSX.readFile(path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const data = XLSX.utils.sheet_to_json(sheet);

  return data.map(row => ({
    Keyword: row.Keyword,
    Volume: Number(row.Volume || 0),
    KD: Number(row.KD || 0),
    OrganicTraffic: Number(row["Organic Traffic"] || 0),
    CPC: Number(row.CPC || 0),
  }));
}

module.exports = { loadKeywords };