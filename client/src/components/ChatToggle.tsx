interface ChatToggleProps {
  onClick?: () => void;
  unreadCount?: number;
}

export default function ChatToggle({ onClick, unreadCount }: ChatToggleProps) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
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
      aria-label="Toggle chat"
    >
      💬
      {unreadCount && unreadCount > 0 && (
        <div
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {unreadCount}
        </div>
      )}
    </button>
  );
}
