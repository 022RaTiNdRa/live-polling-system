import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import StudentOnboarding from "../components/StudentOnboarding";
import HeaderBadge from "../components/HeaderBadge";
import StudentVotingView from "../components/StudentVotingView";
import PollCard from "../components/PollCard";
import AppShell from "../components/AppShell";
import ChatToggle from "../components/ChatToggle";
import ChatPopup from "../components/ChatPopup";
import ChatMessageList from "../components/ChatMessageList";
import ChatInput from "../components/ChatInput";

export default function StudentPage() {
  const { socket } = useSocket();

  const [joined, setJoined] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [poll, setPoll] = useState<any>(null);
  type ChatMessage = { pollId: string; name: string; text: string; ts: number; studentId?: string };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [ended, setEnded] = useState(false);
  const [isKicked, setIsKicked] = useState(false);

  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [sessionId] = useState(() => {
    const existing = localStorage.getItem("studentId");
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem("studentId", id);
    return id;
  });

  useEffect(() => {
    if (!poll) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - new Date(poll.startedAt).getTime()) / 1000
      );

      const remaining = poll.duration - elapsed;

      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        return;
      }

      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [poll]);

  useEffect(() => {
    socket.on("poll_created", (data) => {
      setPoll(data);
      setEnded(false);
      setTypingUsers([]);
      setIsKicked(false);
      
      try {
        socket.emit("join_poll", data.pollId, (res: any) => {
          if (!res?.success) console.warn("join_poll failed:", res?.message);
        });
      } catch (e) {
        console.warn("join_poll error", e);
      }
    });

    
    const handleChatMessage = (m: any) => {
      const ts = typeof m.ts === "number" ? m.ts : Date.parse(m.ts);
      setMessages((prev) => [...prev, { pollId: m.pollId, name: m.name || "", text: m.text, ts: isNaN(ts) ? Date.now() : ts, studentId: m.studentId }]);
      if (!isChatOpen) {
        setUnreadCount((c) => c + 1);
      }
    };
    socket.on("chat_message", handleChatMessage);

    socket.on("vote_updated", (data) => {
      setPoll(data);
    });

    socket.on("poll_closed", (data) => {
      setPoll(data);
      setEnded(true);
      setTimeLeft(null);
      setTypingUsers([]);
    });

    
    socket.on("typing_start", (data: { pollId: string; name: string }) => {
      
      if (data.name === displayName) return;
      
    
      setTypingUsers((prev) => {
        if (prev.includes(data.name)) return prev;
        return [...prev, data.name];
      });
    });

    
    socket.on("typing_stop", (data: { pollId: string; name: string }) => {
      setTypingUsers((prev) => prev.filter((name) => name !== data.name));
    });

    
    const handleKicked = (_: { pollId: string }) => {
      setPoll(null);
      setEnded(false);
      setTimeLeft(null);
      setTypingUsers([]);
      setMessages([]);
      setIsKicked(true);
    };
    socket.on("kicked", handleKicked);

    return () => {
      socket.off("poll_created");
      socket.off("vote_updated");
      socket.off("poll_closed");
      socket.off("chat_message", handleChatMessage);
      socket.off("typing_start");
      socket.off("typing_stop");
      socket.off("kicked", handleKicked);
      if (typingDebounceRef.current) {
        clearTimeout(typingDebounceRef.current);
      }
    };
  }, [socket]);

  const submitVote = (optionId: string) => {
    socket.emit(
      "submit_vote",
      { pollId: poll.pollId, studentId: sessionId, optionId },
      (res: any) => {
        if (!res.success) alert(res.message);
      }
    );
  };

  if (isKicked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-6)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 540,
            background: "var(--color-card)",
            borderRadius: 18,
            padding: "var(--space-6)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--color-text)", marginBottom: "var(--space-4)" }}>
            You were removed from this poll by the teacher.
          </div>
          <div style={{ fontSize: 14, color: "var(--color-subtext)" }}>
            Please wait for the next question or refresh to rejoin.
          </div>
        </div>
      </div>
    );
  }

  if (!joined) {
    return (
      <StudentOnboarding
        onSubmit={(_enteredName) => {
          setJoined(true);

          // set local display name first so presence includes the name
          setDisplayName(_enteredName);

          // emit object with studentId and name so server can store/display it
          socket.emit("student_join", { studentId: sessionId, name: _enteredName });

          socket.emit("get_active_poll", sessionId, (res: any) => {
            if (res.success && res.poll) {
              setPoll(res.poll);
              
              try {
                socket.emit("join_poll", res.poll.pollId, (jr: any) => {
                  if (!jr?.success) console.warn("join_poll failed:", jr?.message);
                });
              } catch (e) {
                console.warn("join_poll error", e);
              }
            }
          });
        }}
      />
    );
  }

  if (!poll && !ended) {
    return (
      <>
        <div
          style={{
            minHeight: "100vh",
            background: "var(--color-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-6)",
            position: "relative",
          }}
        >
        <div
          style={{
            width: "100%",
            maxWidth: 540,
            background: "var(--color-card)",
            borderRadius: 18,
            padding: "var(--space-6)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 600,
            gap: "var(--space-5)",
          }}
        >
          <HeaderBadge />

          <div className="spinner" style={{ marginTop: "var(--space-5)" }} />

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: "var(--color-text)" }}>
              Wait for the teacher to ask questions..
            </div>
          </div>

          <button
            style={{
              position: "absolute",
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
        </div>
        <ChatToggle onClick={() => {
            setIsChatOpen((o) => {
              const next = !o;
              if (next) {
                setUnreadCount(0);
                setTypingUsers([]);
              }
              return next;
            });
          }} unreadCount={unreadCount} />
        <ChatPopup open={isChatOpen}>
          {(tab: 'chat' | 'participants') =>
            tab === 'chat' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <ChatMessageList
                  messages={messages}
                  currentUserId={sessionId}
                  currentUserName={displayName ?? undefined}
                />
                {typingIndicatorText && (
                  <div style={{ padding: '8px 12px', fontSize: 12, color: 'var(--color-subtext)', fontStyle: 'italic', textAlign: 'left' }}>
                    {typingIndicatorText}
                  </div>
                )}
                <ChatInput onSend={sendChatMessage} onInput={handleChatInputChange} />
              </div>
            )
          }
        </ChatPopup>
      </>
    );
  }


  const myVoteOptionId = poll?.myVoteOptionId;
  const hasVoted = Boolean(myVoteOptionId);

  
  const sendChatMessage = (text: string) => {
    if (!poll || !text || !text.trim()) return;
    const payload = { pollId: poll.pollId, studentId: sessionId, name: displayName ?? "", text: text.trim() };
    socket.emit("chat_message", payload, (res: any) => {
      if (!res?.success) console.warn("chat_message failed:", res?.message);
    });
    
    setIsTyping(false);
    if (typingDebounceRef.current) {
      clearTimeout(typingDebounceRef.current);
    }
    socket.emit("typing_stop", { pollId: poll.pollId, name: displayName ?? "" });
    setTypingUsers([]);
  };

  
  const handleChatInputChange = (text: string) => {
    if (!poll) return;

   
    if (text.trim().length > 0 && !isTyping) {
      setIsTyping(true);
      socket.emit("typing_start", { pollId: poll.pollId, name: displayName ?? "" });
    }

    
    if (typingDebounceRef.current) {
      clearTimeout(typingDebounceRef.current);
    }

    
    typingDebounceRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("typing_stop", { pollId: poll.pollId, name: displayName ?? "" });
    }, 1500);
  };

  
  const formatTypingUsers = () => {
    if (typingUsers.length === 0) return "";
    if (typingUsers.length === 1) {
      return `${typingUsers[0]} is typing…`;
    }
    const lastUser = typingUsers[typingUsers.length - 1];
    const otherUsers = typingUsers.slice(0, -1).join(", ");
    return `${otherUsers}, ${lastUser} are typing…`;
  };

  const typingIndicatorText = formatTypingUsers();

  if (hasVoted || ended) {
    return (
      <>
        <AppShell wide>
        
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", marginBottom: "var(--space-5)", color: "var(--color-text)" }}>
          <div style={{ fontSize: 20, fontWeight: 600 }}>Question</div>
          {timeLeft !== null && timeLeft !== undefined && (
            <div style={{ fontSize: 16, color: "#e74c3c", fontWeight: 600 }}>
              ⏱ {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
            </div>
          )}
        </div>

        <PollCard
          question={poll.question}
          options={poll.results}
          timeLeft={timeLeft}
          selectedId={myVoteOptionId}
          disabled
          showResults
        />

        <div style={{ marginTop: "var(--space-6)", textAlign: "center", color: "var(--color-text)", fontWeight: 600 }}>
          Wait for the teacher to ask a new question..
        </div>
      </AppShell>
      <ChatToggle onClick={() => {
        setIsChatOpen((o) => {
          const next = !o;
          if (next) setTypingUsers([]);
          return next;
        });
      }} />
      </>
    );
  }

  return (
    <>
      <AppShell wide>
      <StudentVotingView
        question={poll.question}
        options={poll.results}
        timeLeft={timeLeft}
        selectedId={myVoteOptionId}
        onSelect={(id) => submitVote(id)}
      />
    </AppShell>
    <ChatToggle onClick={() => {
      setIsChatOpen((o) => {
        const next = !o;
        if (next) setTypingUsers([]);
        return next;
      });
    }} />
    <ChatPopup open={isChatOpen}>
      {(tab: 'chat' | 'participants') =>
        tab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ChatMessageList
              messages={messages}
              currentUserId={sessionId}
              currentUserName={displayName ?? undefined}
            />
            {typingIndicatorText && (
              <div style={{ padding: '8px 12px', fontSize: 12, color: 'var(--color-subtext)', fontStyle: 'italic', textAlign: 'left' }}>
                {typingIndicatorText}
              </div>
            )}
            <ChatInput onSend={sendChatMessage} onInput={handleChatInputChange} />
          </div>
        )
      }
    </ChatPopup>
    </>
  );
}