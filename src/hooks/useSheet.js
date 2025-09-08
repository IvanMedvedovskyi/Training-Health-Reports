import { useEffect, useMemo, useState } from "react";
import { fetchCsv } from "../services/sheetService";
import { parseCSV } from "../utils/parseCsv";

// 1p0oudD17EuEHJJa9cgNNkpFZio-tNA5YyNFqJgJtbio - id in the url

const DEFAULT_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSIyZyXybL0_w-nfhDfbaWA0gv1Y0fay1hLGY39vzzxTSGuHsxg0JKeh8_9i_Ev61Eu1K30f53cgkh1/pub?output=csv";

export function useSheet(csvUrl = DEFAULT_URL) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async (signal) => {
    try {
      setError(null);
      const csv = await fetchCsv(csvUrl, signal);
      setRows(parseCSV(csv));
    } catch (e) {
      if (
        e?.name === "CanceledError" ||
        e?.name === "AbortError" ||
        e?.message === "canceled"
      ) {
        return;
      }
      setError(e.message ?? "Fetch error");
    } finally {
      setLoading(false);
    }
  };

  // первый запуск (при маунте)
  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [csvUrl]);

  const columns = useMemo(
    () => (rows.length ? Object.keys(rows[0]) : []),
    [rows]
  );

  // теперь reload вызывается только вручную
  return { rows, columns, loading, error, reload: () => load() };
}
