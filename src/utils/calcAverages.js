const NUMERIC_COLUMNS = [
  "Hur många simträningar har du haft denna vecka?",
  "Hur många gympass har du gjort denna vecka?",
  "Hur många tävlingsdagar har du haft denna vecka?",
  "Hur många ”övriga” träningspass har du haft denna vecka?",
  "Hur många dagar har du varit sjuk denna vecka?",
  "Hur tycker du att simträningen har gått denna vecka?",
];

export function calculateAverages(rows) {
  if (!rows.length) return { perPerson: [], team: {} };

  const grouped = {};

  // группируем строки по имени
  rows.forEach((row) => {
    const name = row["Ditt namn"] || "Unknown";
    if (!grouped[name]) grouped[name] = [];
    grouped[name].push(row);
  });

  const perPerson = Object.entries(grouped).map(([name, items]) => {
    const avg = {};
    NUMERIC_COLUMNS.forEach((col) => {
      const nums = items.map((r) => Number(r[col]) || 0);
      avg[col] = (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
    });
    return { name, ...avg };
  });

  const team = {};
  NUMERIC_COLUMNS.forEach((col) => {
    const nums = rows.map((r) => Number(r[col]) || 0);
    team[col] = (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
  });

  return { perPerson, team };
}
