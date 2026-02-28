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
  disabled?: boolean;
  showResults?: boolean;
  onSelect?: (id: string) => void;
};

export default function StudentPollView({
  question,
  options,
  timeLeft,
  selectedId,
  disabled,
  showResults,
  onSelect,
}: Props) {
  const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");
  const [messages, setMessages] = useState([
    { user: "User 1", text: "Hey there, how can I help?", isMine: false },
    { user: "User 2", text: "Nothing bro, just chilll!", isMine: true },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { user: "You", text: newMessage, isMine: true },
      ]);
      setNewMessage("");
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
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          background: "var(--color-card)",
          borderRadius: 18,
          padding: "var(--space-6)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
          display: "grid",
          gridTemplateColumns: "1fr 350px",
          gap: "var(--space-6)",
          minHeight: 600,
        }}
      >
        {}
        <div>
          <div style={{ marginBottom: "var(--space-4)" }}>
            <div style={{ fontSize: 14, color: "var(--color-subtext)", marginBottom: "var(--space-2)" }}>
              Question
            </div>
            <div
              style={{
                background: "var(--color-accent)",
                color: "white",
                padding: "var(--space-4)",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{question.replace(/^\s*Question\s*\d+\s*/i, '').trim()}</span>
              {timeLeft !== null && timeLeft !== undefined && (
                <span style={{ fontSize: 14 }}>{timeLeft}s</span>
              )}
            </div>
          </div>

          <div style={{ marginBottom: "var(--space-5)" }}>
            {options.map((o, idx) => {
              const selected = selectedId?.toString() === o.optionId.toString();
              const number = idx + 1;

              return (
                <div
                  key={o.optionId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    marginBottom: "var(--space-3)",
                    cursor: disabled ? "default" : "pointer",
                  }}
                  onClick={() => !disabled && onSelect?.(o.optionId)}
                >
                  {}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: selected
                        ? "linear-gradient(135deg, #7765DA, #4F0DCE)"
                        : "#e6e6e6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: selected ? "white" : "var(--color-text)",
                      fontWeight: 600,
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {number}
                  </div>

                  {}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        marginBottom: "var(--space-1)",
                        color: "var(--color-text)",
                      }}
                    >
                      {o.text}
                    </div>
                    {showResults && (
                      <>
                        <div
                          style={{
                            width: "100%",
                            height: 8,
                            background: "#eee",
                            borderRadius: 4,
                            overflow: "hidden",
                            marginBottom: 4,
                          }}
                        >
                          <div
                            style={{
                              width: `${o.percentage}%`,
                              height: "100%",
                              background: selected
                                ? "linear-gradient(135deg, #7765DA, #4F0DCE)"
                                : "#7765DA",
                              transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                            }}
                          />
                        </div>
                        <div style={{ fontSize: 12, color: "var(--color-subtext)" }}>
                          {o.percentage}%
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
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

        {}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderLeft: "1px solid var(--color-border)",
            paddingLeft: "var(--space-5)",
          }}
        >
          {}
          <div
            style={{
              display: "flex",
              gap: "var(--space-4)",
              marginBottom: "var(--space-4)",
              borderBottom: "1px solid var(--color-border)",
              paddingBottom: "var(--space-2)",
            }}
          >
            <button
              onClick={() => setActiveTab("chat")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                color: activeTab === "chat" ? "var(--color-primary-light)" : "var(--color-subtext)",
                borderBottom: activeTab === "chat" ? "2px solid var(--color-primary-light)" : "none",
                paddingBottom: "var(--space-1)",
              }}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab("participants")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                color: activeTab === "participants" ? "var(--color-primary-light)" : "var(--color-subtext)",
                borderBottom: activeTab === "participants" ? "2px solid var(--color-primary-light)" : "none",
                paddingBottom: "var(--space-1)",
              }}
            >
              Participants
            </button>
          </div>

          {}
          {activeTab === "chat" && (
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  marginBottom: "var(--space-3)",
                  paddingRight: "var(--space-2)",
                }}
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      marginBottom: "var(--space-3)",
                      display: "flex",
                      justifyContent: msg.isMine ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "75%",
                        background: msg.isMine
                          ? "linear-gradient(135deg, #7765DA, #4F0DCE)"
                          : "#333",
                        color: "white",
                        padding: "var(--space-2) var(--space-3)",
                        borderRadius: 8,
                        fontSize: 12,
                        wordWrap: "break-word",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {}
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  style={{
                    flex: 1,
                    padding: "var(--space-2)",
                    borderRadius: 6,
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    background: "linear-gradient(135deg, #7765DA, #4F0DCE)",
                    color: "white",
                    border: "none",
                    padding: "var(--space-2) var(--space-3)",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {}
          {activeTab === "participants" && (
            <div>
              <div style={{ fontSize: 12, color: "var(--color-subtext)", marginBottom: "var(--space-2)" }}>
                Online: 3 students
              </div>
              {["Alice", "Bob", "Charlie"].map((name, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "var(--space-2)",
                    marginBottom: "var(--space-2)",
                    borderRadius: 6,
                    background: "var(--color-bg)",
                    fontSize: 12,
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
