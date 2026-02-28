import { useState } from "react";

type Option = {
  optionId: string;
  text: string;
  count: number;
  percentage: number;
};

type Props = {
  question: string;
  options: Option[];
  timeLeft?: number | null;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

export default function StudentVotingView({
  question,
  options,
  timeLeft,
  selectedId,
  onSelect,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const [localSelected, setLocalSelected] = useState<string | null>(selectedId ?? null);
  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (localSelected && !submitted) {
      setSubmitted(true);
      onSelect?.(localSelected);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-5)",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 640,
          background: "var(--color-card)",
          borderRadius: 18,
          padding: "var(--space-6)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
        }}
      >
        {}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-5)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600 }}>Question</div>
          {timeLeft !== null && timeLeft !== undefined && (
            <div style={{ fontSize: 14, color: "#e74c3c", fontWeight: 600 }}>
              ⏱ {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
            </div>
          )}
        </div>

        {}
        <div
          style={{
            background: "var(--color-accent)",
            color: "white",
            padding: "var(--space-4)",
            borderRadius: 10,
            marginBottom: "var(--space-6)",
            fontSize: 18,
            fontWeight: 600,
            lineHeight: "1.5",
          }}
        >
          {question}
        </div>

        {}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
            marginBottom: "var(--space-6)",
          }}
        >
          {options.map((o, idx) => {
            const selected = (localSelected ?? selectedId)?.toString() === o.optionId.toString();
            const isHovered = hoveredId === o.optionId.toString();

            return (
              <div
                key={o.optionId}
                onClick={() => !submitted && setLocalSelected(o.optionId)}
                onMouseEnter={() => setHoveredId(o.optionId.toString())}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-4)",
                  padding: "var(--space-4) var(--space-5)",
                  background: selected ? "#f6f4ff" : isHovered ? "#fafafa" : "white",
                  border: selected ? "2px solid #7765DA" : "1px solid var(--color-border)",
                  borderRadius: 12,
                  cursor: submitted ? "not-allowed" : "pointer",
                  transition: "all 0.12s ease",
                }}
              >
                {}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: selected
                      ? "linear-gradient(135deg, #7765DA, #4F0DCE)"
                      : "#d3d3d3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: selected ? "white" : "#666",
                    fontWeight: 700,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>

                {}
                <div style={{ fontSize: 16, color: "var(--color-text)", fontWeight: 500, flex: 1 }}>
                  {o.text}
                </div>

                {}
                {selected && (
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #7765DA, #4F0DCE)",
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleSubmit}
            disabled={!localSelected || submitted}
            style={{
              paddingLeft: "var(--space-7)",
              paddingRight: "var(--space-7)",
              paddingTop: "var(--space-3)",
              paddingBottom: "var(--space-3)",
              background: submitted
                ? "#999"
                : localSelected
                ? "linear-gradient(135deg, #7765DA, #4F0DCE)"
                : "#d3d3d3",
              color: "white",
              border: "none",
              borderRadius: 999,
              fontWeight: 600,
              cursor: submitted
                ? "not-allowed"
                : localSelected
                ? "pointer"
                : "not-allowed",
              fontSize: 16,
            }}
          >
            {submitted ? "Submitted" : "Submit"}
          </button>
        </div>
      </div>

      {}
      <button
        style={{
          position: "fixed",
          bottom: "var(--space-5)",
          right: "var(--space-5)",
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7765DA, #4F0DCE)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: "white",
          boxShadow: "0 4px 12px rgba(119, 101, 218, 0.3)",
        }}
        title="Chat"
      >
        💬
      </button>
    </div>
  );
}
