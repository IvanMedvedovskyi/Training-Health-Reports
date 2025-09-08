import { useState } from "react";
import { useSheet } from "./hooks/useSheet";
import Spinner from "./components/Spinner";
import ErrorBanner from "./components/ErrorBanner";
import Toolbar from "./components/Toolbar";
import DataTable from "./components/DataTable";

export default function App() {
  const { rows, columns, loading, error, reload } = useSheet();
  const [search, setSearch] = useState("");

  // фильтрация по имени (колонка "Ditt namn")
  const filteredRows = rows.filter((row) =>
    row["Ditt namn"]?.toLowerCase().includes(search.toLowerCase())
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
      <p style={{ color: "#666" }}>
        Live data from Google Sheets (CSV publish + polling)
      </p>

      <Toolbar onRefresh={reload} search={search} onSearch={setSearch} />

      {loading && <Spinner />}
      {error && <ErrorBanner message={error} />}

      {!loading && !error && (
        <DataTable rows={filteredRows} columns={columns} />
      )}
    </div>
  );
}
