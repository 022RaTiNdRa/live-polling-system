import React from "react";

interface ChatMessageBubbleProps {
  name: string;
  text: string;
  isOwn?: boolean;
}

export default function ChatMessageBubble({ name, text, isOwn = false }: ChatMessageBubbleProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: isOwn ? 'flex-end' : 'flex-start',
    marginBottom: 8,
  };

  const bubbleStyle: React.CSSProperties = {
    background: isOwn ? '#7765DA' : '#2D2D2D',
    color: '#fff',
    borderRadius: 12,
    padding: '8px 12px',
    maxWidth: '75%',
    wordBreak: 'break-word',
  };

  const nameStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  };

  return (
    <div style={containerStyle}>
      <div style={nameStyle}>{name}</div>
      <div style={bubbleStyle}>{text}</div>
    </div>
  );
}
