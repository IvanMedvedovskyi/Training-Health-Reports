import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPDF = (rows, columns) => {
  const doc = new jsPDF("l", "pt", "a4");

  autoTable(doc, {
    head: [columns],
    body: rows.map((row) => columns.map((c) => row[c] ?? "")),
    startY: 40,
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [30, 41, 59] },
    theme: "grid",
  });

  doc.setFontSize(14);
  doc.text("Weekly Report — Training & Health", 40, 25);
  doc.save("weekly-report.pdf");
};

export function exportAveragesPDF(
  avgRows,
  columns,
  title = "Averages — Weekly Report"
) {
  const doc = new jsPDF("l", "pt", "a4");
  doc.setFontSize(14);
  doc.text(title, 40, 25);

  const body = avgRows.map((r) => columns.map((c) => r[c] ?? ""));
  autoTable(doc, {
    head: [columns],
    body,
    startY: 40,
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [30, 41, 59] },
    theme: "grid",
    margin: { top: 40, bottom: 30 },
  });

  doc.save("weekly-report-averages.pdf");
}
