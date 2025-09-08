export default function ColumnPicker({
  allColumns = [],
  visible = [],
  locked = [],
  onToggle,
  onSelectAll,
  onClear,
}) {
  if (!allColumns.length) return null;

  return (
    <details style={{ position: "relative" }}>
      <summary
        style={{
          cursor: "pointer",
          padding: "8px 12px",
          border: "1px solid #cbd5e1",
          borderRadius: 8,
          background: "#fff",
        }}
      >
        Columns ({visible.length}/{allColumns.length})
      </summary>

      <div
        style={{
          position: "absolute",
          zIndex: 10,
          marginTop: 8,
          padding: 12,
          width: 340,
          maxHeight: 300,
          overflow: "auto",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button type="button" onClick={onSelectAll}>
            Select all
          </button>
          <button type="button" onClick={onClear}>
            Clear
          </button>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {allColumns.map((col) => {
            const disabled = locked.includes(col);
            const checked = visible.includes(col);
            return (
              <li
                key={col}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 0",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onToggle(col)}
                />
                <span style={{ opacity: disabled ? 0.6 : 1 }}>{col}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}
