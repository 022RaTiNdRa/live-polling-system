import React from "react";

interface ChatPopupProps {
  open: boolean;
  /** if provided, will be shown in parentheses on the participants tab */
  participantCount?: number;
  
  children?: React.ReactNode | ((activeTab: 'chat' | 'participants') => React.ReactNode);
}

export default function ChatPopup({ open, participantCount, children }: ChatPopupProps) {
  const [activeTab, setActiveTab] = React.useState<'chat' | 'participants'>('chat');

  // when we open the popup and there are participants, default to that tab so
  // the teacher doesn't have to manually switch every time.
  React.useEffect(() => {
    if (open && participantCount && participantCount > 0) {
      setActiveTab('participants');
    }
  }, [open, participantCount]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 88, 
        right: 24,
        width: 360,
        height: 500,
        background: "white",
        borderRadius: 16,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 1000,
      }}
    >
      {}
      <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}>
        <button
          onClick={() => setActiveTab('chat')}
          style={{
            flex: 1,
            padding: '12px 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'chat' ? 600 : 400,
            color: activeTab === 'chat' ? '#000' : '#666',
            borderBottom: activeTab === 'chat' ? '3px solid #7765DA' : '3px solid transparent',
          }}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          style={{
            flex: 1,
            padding: '12px 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'participants' ? 600 : 400,
            color: activeTab === 'participants' ? '#000' : '#666',
            borderBottom: activeTab === 'participants' ? '3px solid #7765DA' : '3px solid transparent',
          }}
        >
          Participants{participantCount !== undefined ? ` (${participantCount})` : ''}
        </button>
      </div>

      {}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {typeof children === 'function' ? children(activeTab) : children}
      </div>
    </div>
  );
}
