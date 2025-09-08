import { exportAveragesPDF, exportPDF } from "../utils/exportPDF";

export default function Toolbar({
  onRefresh,
  search,
  onSearch,
  filteredRows,
  columns,
  averagesRows,
}) {
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
      <button
        onClick={onRefresh}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Refresh now
      </button>

      <button
        style={{
          background: "#ff0000ff",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        onClick={() => exportPDF(filteredRows, columns)}
      >
        Export PDF
      </button>

      <button
        style={{
          background: "#a74658ff",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        onClick={() => exportAveragesPDF(averagesRows, columns)}
      >
        Export Averages PDF
      </button>

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        style={{
          padding: "8px 12px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />
    </div>
  );
}
