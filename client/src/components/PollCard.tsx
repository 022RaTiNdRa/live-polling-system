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
  disabled?: boolean;
  onSelect?: (id: string) => void;
  showResults?: boolean;
};

export default function PollCard({
  question,
  options,
  timeLeft,
  selectedId,
  disabled,
  onSelect,
  showResults,
}: Props) {
  return (
    <div className="poll-card">
      <div className="poll-card__header">
        <div className="poll-card__question">{question}</div>

        {timeLeft !== null && timeLeft !== undefined && (
          <div className="poll-card__timer">{timeLeft}s</div>
        )}
      </div>

      <div className="poll-card__options">
        {options.map((o, idx) => {
          const selected = selectedId?.toString() === o.optionId.toString();
          return (
            <div key={o.optionId} className="poll-card__option" style={{ marginBottom: idx < options.length - 1 ? "var(--space-4)" : 0 }}>
              <div
                onClick={() => !disabled && onSelect?.(o.optionId)}
                className={`poll-card__option-button${selected ? " selected" : ""}${
                  disabled ? " disabled" : ""
                }${showResults ? " results" : ""}`}
                style={{
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {}
                {showResults && (
                  <div
                    className="poll-card__option-fill"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: `${o.percentage}%`,
                      background: "linear-gradient(135deg, #7765DA, #4F0DCE)",
                      zIndex: 0,
                      transition: "width 0.6s ease",
                    }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 1,
                    gap: "var(--space-3)",
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "white",
                      border: selected ? "2px solid #7765DA" : "1px solid rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#000",
                      fontWeight: 600,
                      fontSize: 14,
                      flexShrink: 0,
                      zIndex: 2, 
                    }}
                  >
                    {idx + 1}
                  </span>

                  <span style={{ flex: 1, fontSize: 16, color: "var(--color-text)" }}>{o.text}</span>

                  {showResults && (
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--color-text)",
                        marginLeft: "auto",
                      }}
                    >
                      {o.percentage}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}