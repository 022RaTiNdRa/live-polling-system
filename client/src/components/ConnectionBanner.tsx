export default function ConnectionBanner({ connected }: { connected?: boolean }) {
  if (connected) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "linear-gradient(90deg,#fff7cc,#fffef0)",
        color: "#6b4f00",
        textAlign: "center",
        padding: "6px 8px",
        fontSize: 13,
        zIndex: 9999,
        boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
      }}
      aria-live="polite"
    >
      Waking up server... please wait.
    </div>
  );
}
