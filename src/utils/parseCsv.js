export function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((c === "\n" || c === "\r") && !inQuotes) {
      if (cell.length || row.length) {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      }
      if (c === "\r" && next === "\n") i++;
    } else {
      cell += c;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  if (!rows.length) return [];

  const [headers, ...data] = rows;
  return data
    .filter((r) => r.some((v) => (v ?? "").trim() !== ""))
    .map((r) => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h.trim()] = (r[i] ?? "").trim();
      });
      return obj;
    });
}
