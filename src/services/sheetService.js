export async function fetchCsv(url, signal) {
  const res = await fetch(url, { signal, cache: "no-store" });
  const text = await res.text();

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("csv") && /<html|<!doctype html/i.test(text)) {
    throw new Error("Expected CSV but got HTML (проверь абсолютный URL)");
  }
  return text;
}
