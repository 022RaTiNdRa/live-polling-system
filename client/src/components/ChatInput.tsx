import { useState } from "react";
import type { KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
  onInput?: (text: string) => void;
}

export default function ChatInput({ onSend, onInput }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const t = text.trim();
    if (t.length === 0) return;
    onSend(t);
    setText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: 8,
        gap: 8,
        height: 44,
      }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => {
          const val = e.target.value;
          setText(val);
          onInput?.(val);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        style={{
          flex: 1,
          borderRadius: 22,
          border: "1px solid #ccc",
          padding: "0 12px",
          height: "100%",
          outline: "none",
        }}
      />
      <button
        onClick={handleSend}
        style={{
          padding: "0 16px",
          height: "100%",
          borderRadius: 22,
          border: "none",
          background: "#7765DA",
          color: "white",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Send
      </button>
    </div>
  );
}
