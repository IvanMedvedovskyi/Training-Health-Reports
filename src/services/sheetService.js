import { http } from "../api/axios";

export async function fetchCsv(url, signal) {
  const res = await http.get(url, {
    responseType: "text",
    signal,
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}
