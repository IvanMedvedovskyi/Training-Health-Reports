import { useEffect, useMemo, useState } from "react";
import { useSheet } from "./hooks/useSheet";
import Spinner from "./components/Spinner";
import ErrorBanner from "./components/ErrorBanner";
import Toolbar from "./components/Toolbar";
import DataTable from "./components/DataTable";
import ColumnPicker from "./components/ColumnPicker";
import { buildAverages } from "./utils/buildAverages";
import WeeklyChartPro from "./components/WeeklyChart";

export default function App() {
  const { rows, columns, loading, error, reload } = useSheet();
  const [search, setSearch] = useState("");
  const [visibleCols, setVisibleCols] = useState([]);

  useEffect(() => {
    if (columns?.length) setVisibleCols(columns);
  }, [columns]);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) =>
        (row["Ditt namn"] || "").toLowerCase().includes(search.toLowerCase())
      ),
    [rows, search]
  );

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

  return (
    <div
      style={{
        padding: 16,
        fontFamily: "system-ui, sans-serif",
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      <h1>Weekly Report — Training & Health</h1>

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
