import React from "react";
import ChatMessageBubble from "./ChatMessageBubble";

export interface ChatMessage {
  pollId: string;
  name: string;
  text: string;
  ts: number;
  studentId?: string;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserName?: string;
  currentUserId?: string;
}

export default function ChatMessageList({ messages, currentUserName, currentUserId }: ChatMessageListProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 12,
    height: '100%',
    overflowY: 'auto',
  };

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length]);

  if (!messages || messages.length === 0) {
    return (
      <div style={{ ...containerStyle, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#666' }}>No messages yet</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={containerStyle}>
      {messages.map((m, idx) => {
        const isOwn = currentUserId
          ? m.studentId === currentUserId
          : currentUserName
          ? m.name === currentUserName
          : false;
        return (
          <ChatMessageBubble
            key={idx}
            name={m.name}
            text={m.text}
            isOwn={isOwn}
          />
        );
      })}
    </div>
  );
}
