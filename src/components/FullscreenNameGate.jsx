import { useEffect, useRef, useState } from "react";

export function FullscreenNameGate({ rows, onSubmit }) {
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const raw = name.trim(); // original, for display
    const normalized = raw.toLowerCase().replace(/\s+/g, " ");

    if (!raw) return;

    const exists = rows.some(
      (row) =>
        (row["Ditt namn"] || "").trim().toLowerCase().replace(/\s+/g, " ") ===
        normalized
    );

    if (!exists) {
      alert("This name was not found in the data. Please try again.");
      return;
    }

    // save the original (with uppercase letters)
    onSubmit(raw);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "linear-gradient(180deg,#0f172a,#111827)",
        display: "grid",
        placeItems: "center",
        color: "white",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "min(520px, 92vw)",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(6px)",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        <h2 style={{ margin: "0 0 20px" }}>Enter your name</h2>
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="For example: John Doe"
          style={{
            width: "95%",
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)",
            color: "white",
            outline: "none",
            marginBottom: 12,
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 10,
            border: "none",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Continue
        </button>
      </form>
    </div>
  );
}
