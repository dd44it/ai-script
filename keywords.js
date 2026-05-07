const blocked = [
  "kling ai",
  "pixai",
  "runway ai",
  "openart"
];

function filterKeywords(list) {
  return list.filter(row => {
    if (!row.Keyword) return false;

    return !blocked.includes(
      row.Keyword.toLowerCase().trim()
    );
  });
}

function calculateScore(row, prompt) {
  const text = row.Keyword.toLowerCase();

  const tokens = prompt.toLowerCase().split(" ");

  let matchScore = 0;

  tokens.forEach(t => {
    if (text.includes(t)) {
      matchScore += 1;
    }
  });

  const volumeScore = row.Volume * 0.4;

  const trafficScore = row.OrganicTraffic * 0.3;

  const kdScore = (100 - row.KD) * 0.2;

  return (
    volumeScore +
    trafficScore +
    kdScore +
    matchScore * 10
  );
}

module.exports = { filterKeywords, calculateScore };