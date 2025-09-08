export default function ErrorBanner({ message }) {
  return (
    <div
      style={{
        background: "#ffeaea",
        border: "1px solid #ffb3b3",
        color: "#b00020",
        padding: "8px 12px",
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      Error: {message}
    </div>
  );
}
