export default function DataTable({ rows, columns }) {
  if (!rows.length) return <div>No data</div>;

  const nameColumn = "Namn";

  const grouped = rows.reduce((acc, row) => {
    const name = row[nameColumn] || "Unknown";
    if (!acc[name]) acc[name] = [];
    acc[name].push(row);
    return acc;
  }, {});

  const perPerson = Object.entries(grouped).map(([name, personRows]) => {
    const avg = {};
    columns.forEach((c) => {
      const nums = personRows.map((r) => Number(r[c])).filter((n) => !isNaN(n));
      if (nums.length) {
        avg[c] = (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
      } else {
        avg[c] = "";
      }
    });
    return { name, avg };
  });

  const team = {};
  columns.forEach((c) => {
    const nums = rows.map((r) => Number(r[c])).filter((n) => !isNaN(n));
    if (nums.length) {
      team[c] = (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
    } else {
      team[c] = "";
    }
  });

  const renderTable = (data, getValue) => (
    <div
      style={{
        overflowX: "auto",
        width: "100%",
        marginTop: 20,
        maxHeight: "50vh",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c}
                style={{
                  background: "#1E293B",
                  color: "white",
                  textAlign: "center",
                  padding: "14px 10px",
                  fontWeight: "600",
                  fontSize: "14px",
                  borderBottom: "2px solid #334155",
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "#F8FAFC" : "white",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#E2E8F0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  i % 2 === 0 ? "#F8FAFC" : "white")
              }
            >
              {columns.map((c, j) => (
                <td
                  key={j}
                  style={{
                    padding: "12px 10px",
                    borderBottom: "1px solid #E2E8F0",
                    textAlign: j === columns.length - 1 ? "left" : "center",
                    fontSize: "14px",
                    color: "#1E293B",
                  }}
                >
                  {getValue(row, c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {renderTable(rows, (row, c) => row[c])}

      <h2 style={{ marginTop: 40 }}>Averages</h2>
      {renderTable(
        [
          ...perPerson.map((p) => ({
            ...p.avg,
            [nameColumn]: `${p.name} — Avg`,
          })),
          { ...team, [columns[0]]: "Team Average" },
        ],
        (row, c) => row[c]
      )}
    </>
  );
}
