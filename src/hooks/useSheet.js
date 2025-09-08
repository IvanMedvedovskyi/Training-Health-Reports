import { useEffect, useRef, useState } from "react";
import { fetchCsv } from "../services/sheetService";
import { parseCSV } from "../utils/parseCsv";

const SHEET_ID = "1p0oudD17EuEHJJa9cgNNkpFZio-tNA5YyNFqJgJtbio";
const GID = "775762684";
const DEFAULT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;

const isEmptyCell = (v) =>
  v === null || v === undefined || (typeof v === "string" && v.trim() === "");

export function useSheet(csvUrl = DEFAULT_URL) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const controllerRef = useRef(null);

  const cleanData = (rawRows) => {
    if (!rawRows?.length) {
      setRows([]);
      setColumns([]);
      return;
    }

    const allCols = Object.keys(rawRows[0]);

    const validCols = allCols.filter((col) =>
      rawRows.some((r) => !isEmptyCell(r[col]))
    );

    const trimmedRows = rawRows.map((r) => {
      const obj = {};
      validCols.forEach((c) => {
        obj[c] = r[c];
      });
      return obj;
    });

    setColumns(validCols);
    setRows(trimmedRows);
  };

  const load = async (signal) => {
    try {
      setLoading(true);
      setError(null);

      const csv = await fetchCsv(csvUrl, signal);
      const rawRows = parseCSV(csv);
      cleanData(rawRows);
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
      setColumns([]);
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

  const reload = () => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    load(controllerRef.current.signal);
  };

  return { rows, columns, loading, error, reload };
}
