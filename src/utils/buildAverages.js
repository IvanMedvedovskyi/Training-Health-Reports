export function buildAverages(rows, columns, nameColumn = "Ditt namn") {
  const grouped = rows.reduce((acc, row) => {
    const name = row[nameColumn] || "Unknown";
    (acc[name] ||= []).push(row);
    return acc;
  }, {});

  const perPerson = Object.entries(grouped).map(([name, personRows]) => {
    const avg = {};
    columns.forEach((c) => {
      const nums = personRows.map((r) => Number(r[c])).filter((n) => !isNaN(n));
      avg[c] = nums.length
        ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1)
        : "";
    });
    return { ...avg, [nameColumn]: `${name} — Avg` };
  });

  const team = {};
  columns.forEach((c) => {
    const nums = rows.map((r) => Number(r[c])).filter((n) => !isNaN(n));
    team[c] = nums.length
      ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1)
      : "";
  });
  const teamRow = { ...team, [columns[0]]: "Team Average" };

  return [...perPerson, teamRow];
}
