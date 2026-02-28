

type Option = {
  optionId: string;
  text: string;
  count: number;
  percentage: number;
};



type Props = {
  question: string;
  options: Option[];
  onAskNewQuestion?: () => void;
};

export default function TeacherPollView({
  question,
  options,
  onAskNewQuestion,
}: Props) {
  

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        padding: 0,
        margin: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          background: "transparent",
          borderRadius: 0,
          padding: "var(--space-6)",
          boxShadow: "none",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        
        <div style={{ width: "100%" }}>
          <div style={{ marginBottom: "24px", width: "100%" }}>
            <div style={{ fontSize: 14, color: "var(--color-subtext)", marginBottom: "8px" }}>Question</div>

            
            <div
              style={{
                background: "linear-gradient(180deg,#3b3b3b,#2d2d2d)",
                color: "white",
                padding: "16px 18px",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                width: "100%",
                boxSizing: "border-box",
                marginBottom: 0,
              }}
            >
              {question}
            </div>

            
            <div
              style={{
                border: "2px solid rgba(99,102,241,0.12)",
                borderRadius: 8,
                padding: 18,
                background: "rgba(255,255,255,0.98)",
                boxSizing: "border-box",
                marginTop: 0,
              }}
            >
              {options.map((o, idx) => (
                <div key={o.optionId} style={{ position: "relative", marginBottom: idx < options.length - 1 ? 14 : 0 }}>
                  
                  <div
                    style={{
                      position: "absolute",
                      left: 18,
                      right: 18,
                      top: 0,
                      bottom: 0,
                      borderRadius: 8,
                      overflow: "hidden",
                      pointerEvents: "none",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: `${o.percentage}%`,
                        height: "100%",
                        background: "linear-gradient(90deg,#7c63f5,#635be6)",
                        transition: "width 0.6s ease",
                        borderRadius: 8,
                      }}
                    />
                  </div>

                  
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "12px 18px",
                      borderRadius: 8,
                      background: "transparent",
                      zIndex: 2,
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#4b2bd6",
                        fontWeight: 700,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </div>

                    <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#222" }}>{o.text}</div>

                    <div
                      style={{
                        minWidth: 56,
                        textAlign: "right",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          background: "white",
                          padding: "6px 10px",
                          borderRadius: 8,
                          fontWeight: 700,
                          color: "#222",
                          boxShadow: "0 1px 0 rgba(0,0,0,0.03)",
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        {o.percentage}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onAskNewQuestion}
            style={{
              background: "linear-gradient(135deg, #7765DA, #4F0DCE)",
              color: "white",
              border: "none",
              padding: "var(--space-3) var(--space-5)",
              borderRadius: 999,
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            + Ask a new question
          </button>
        </div>

        </div>
    </div>
  );
}
