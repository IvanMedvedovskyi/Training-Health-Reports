import { useEffect, useMemo, useState, useRef } from "react";
import { fetchCsv } from "../services/sheetService";
import { parseCSV } from "../utils/parseCsv";

const SHEET_ID = "1p0oudD17EuEHJJa9cgNNkpFZio-tNA5YyNFqJgJtbio";
const GID = "775762684";

const DEFAULT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;

export function useSheet(csvUrl = DEFAULT_URL) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const controllerRef = useRef(null);

  const load = async (signal) => {
    try {
      setLoading(true);
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
      setError(e?.message || "Fetch error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    load(controllerRef.current.signal);
    return () => controllerRef.current?.abort();
  }, [csvUrl]);

  const columns = useMemo(
    () => (rows.length ? Object.keys(rows[0]) : []),
    [rows]
  );

  const reload = () => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    load(controllerRef.current.signal);
  };

  return { rows, columns, loading, error, reload };
}
