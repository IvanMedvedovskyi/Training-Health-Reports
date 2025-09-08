import { useEffect, useMemo, useState } from "react";
import { useSheet } from "./hooks/useSheet";
import Spinner from "./components/Spinner";
import ErrorBanner from "./components/ErrorBanner";
import Toolbar from "./components/Toolbar";
import DataTable from "./components/DataTable";
import ColumnPicker from "./components/ColumnPicker";
import { buildAverages } from "./utils/buildAverages";
import WeeklyChartPro from "./components/WeeklyChart";
import { FullscreenNameGate } from "./components/FullscreenNameGate";

export default function App() {
  const { rows, columns, loading, error, reload } = useSheet();
  const [search, setSearch] = useState("");
  const [visibleCols, setVisibleCols] = useState([]);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (columns?.length) setVisibleCols(columns);
  }, [columns]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const nameMatch = userName
        ? (row["Ditt namn"] || "").toLowerCase() === userName.toLowerCase()
        : true;
      const searchMatch = (row["Ditt namn"] || "")
        .toLowerCase()
        .includes(search.toLowerCase());
      return nameMatch && searchMatch;
    });
  }, [rows, search, userName]);

  const toggleCol = (col) => {
    setVisibleCols((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const selectAll = () => setVisibleCols(columns);

  const averagesRows = useMemo(
    () => buildAverages(filteredRows, visibleCols, "Ditt namn"),
    [filteredRows, visibleCols]
  );

  if (!userName) {
    return <FullscreenNameGate rows={rows} onSubmit={setUserName} />;
  }

  return (
    <div style={{ padding: 16, maxWidth: 1400, margin: "0 auto" }}>
      <h1>Weekly Report — Training & Health</h1>

      <p style={{ marginBottom: 8 }}>
        <strong>Name:</strong> {userName}
        <button
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            marginLeft: "15px",
          }}
          onClick={() => setUserName(null)}
        >
          Change
        </button>
      </p>

      <WeeklyChartPro rows={filteredRows} />

      <p style={{ color: "#666" }}>
        Live data from Google Sheets (CSV publish)
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Toolbar
          onRefresh={reload}
          search={search}
          onSearch={setSearch}
          filteredRows={filteredRows}
          columns={visibleCols}
          averagesRows={averagesRows}
        />
        <ColumnPicker
          allColumns={columns}
          visible={visibleCols}
          onToggle={toggleCol}
          onSelectAll={selectAll}
        />
      </div>

      {loading && <Spinner />}
      {error && <ErrorBanner message={error} />}

      {!loading && !error && visibleCols.length > 0 && (
        <DataTable rows={filteredRows} columns={visibleCols} />
      )}
    </div>
  );
}
