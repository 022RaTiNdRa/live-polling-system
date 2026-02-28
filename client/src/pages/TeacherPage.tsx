import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import AppShell from "../components/AppShell";
import HeaderBadge from "../components/HeaderBadge";
import PrimaryButton from "../components/PrimaryButton";
import ChatToggle from "../components/ChatToggle";
import ChatPopup from "../components/ChatPopup";
import ChatMessageList from "../components/ChatMessageList";
import ChatInput from "../components/ChatInput";
import TeacherPollView from "../components/TeacherPollView";
import PollCard from "../components/PollCard";
import PollHistoryView from "../components/PollHistoryView";

export default function TeacherPage() {
  const { socket, connected } = useSocket();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState(60);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [selections, setSelections] = useState<string[]>(["", ""]); // per-option: 'yes' | 'no' | ''

  const [poll, setPoll] = useState<any>(null);
  type ChatMessage = { pollId: string; name: string; text: string; ts: number; studentId?: string };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ended, setEnded] = useState(false);
  const [studentCount, setStudentCount] = useState(0);

  const [participants, setParticipants] = useState<{ sessionId: string; name?: string }[]>([]);

  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [dbConnected, setDbConnected] = useState(true); // track server DB health


  useEffect(() => {
    // request initial presence so teacher sees students already online
    socket.emit(
      "get_presence",
      (payload: { count: number; students: { sessionId: string; name?: string }[] }) => {
        setStudentCount(payload.count);
        setParticipants(payload.students);
      }
    );

    socket.on("poll_created", (data) => {
      setPoll(data);
      setEnded(false);
      setTypingUsers([]);
      
      try {
        socket.emit("join_poll", data.pollId, (res: any) => {
          if (!res?.success) console.warn("join_poll failed:", res?.message);
        });
      } catch (e) {
        console.warn("join_poll error", e);
      }
    });

    socket.on("vote_updated", (data) => {
      setPoll(data);
    });

    socket.on("poll_closed", (data) => {
      setPoll(data);
      setEnded(true);
      setTypingUsers([]);
    });

    const handlePresence = (payload: { count: number; students: { sessionId: string; name?: string }[] }) => {
      setStudentCount(payload.count);
      setParticipants(payload.students);
    };

    socket.on("presence_update", handlePresence);

    
    socket.on("participants_update", (list: { sessionId: string; name?: string }[]) => {
      setParticipants(list);
    });

    socket.on("poll_history", (data) => {
      setHistory(data);
    });

    socket.on("db_status", ({ connected }) => {
      setDbConnected(connected);
    });

    
    const handleChatMessage = (m: any) => {
      const ts = typeof m.ts === "number" ? m.ts : Date.parse(m.ts);
      setMessages((prev) => [...prev, { pollId: m.pollId, name: m.name || "", text: m.text, ts: isNaN(ts) ? Date.now() : ts, studentId: m.studentId }]);
      if (!isChatOpen) {
        setUnreadCount((c) => c + 1);
      }
    };
    socket.on("chat_message", handleChatMessage);

    
    socket.on("typing_start", (data: { pollId: string; name: string }) => {
     
      if (data.name === "Teacher") return;
      
      
      setTypingUsers((prev) => {
        if (prev.includes(data.name)) return prev;
        return [...prev, data.name];
      });
    });

    
    socket.on("typing_stop", (data: { pollId: string; name: string }) => {
      setTypingUsers((prev) => prev.filter((name) => name !== data.name));
    });

    return () => {
      socket.off("poll_created");
      socket.off("vote_updated");
      socket.off("poll_closed");
      socket.off("presence_update", handlePresence);
      socket.off("participants_update");
      socket.off("poll_history");
      socket.off("db_status");
      socket.off("chat_message", handleChatMessage);
      socket.off("typing_start");
      socket.off("typing_stop");
    };
  }, [socket]);

  const updateOption = (index: number, value: string) => {
    const copy = [...options];
    copy[index] = value;
    setOptions(copy);
  };

  const addOption = () => {
    setOptions([...options, ""]);
    setSelections((prev) => [...prev, ""]);
  };

  useEffect(() => {
    
    setSelections((prev) => {
      if (prev.length === options.length) return prev;
      const next = prev.slice(0, options.length);
      while (next.length < options.length) next.push("");
      return next;
    });
  }, [options]);

  const createPoll = () => {
    if (poll && !ended) return;

    socket.emit(
      "create_poll",
      { question, options, duration, correctIndex },
      (res: any) => {
        if (!res.success) alert(res.message);
      }
    );
  };

  const fetchHistory = () => {
    socket.emit("get_poll_history");
    setShowHistory(true);
  };

  const resetForNewPoll = () => {
    setPoll(null);
    setEnded(false);
    setQuestion("");
    setOptions(["", ""]);
    setCorrectIndex(null);
    setSelections(["", ""]);
  };

  const handleKickStudent = (sessionId: string) => {
    setParticipants((prev) => prev.filter((p) => p.sessionId !== sessionId));
    socket.emit("kick_student", { pollId: poll.pollId, studentId: sessionId });
  };


  const sendChatMessage = (text: string) => {
    if (!poll || !text || !text.trim()) return;
    const payload = { pollId: poll.pollId, name: "Teacher", text: text.trim() };
    socket.emit("chat_message", payload, (res: any) => {
      if (!res?.success) console.warn("chat_message failed:", res?.message);
    });
    
    if (typingDebounceRef.current) {
      clearTimeout(typingDebounceRef.current);
    }
    setTypingUsers([]);
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

    if (showHistory) {
      return (
        <PollHistoryView
          polls={history}
          onBack={() => setShowHistory(false)}
        />
      );
    }

  if (!poll) {
    return (
      <AppShell>
        <HeaderBadge />

        <div style={{ marginBottom: "var(--space-5)" }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Let’s Get Started</div>
          <div style={{ fontSize: 14, color: "var(--color-subtext)", marginTop: "var(--space-1)" }}>
            you’ll have the ability to create and manage polls, ask questions, and monitor your students’ responses in real-time
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-2)",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600 }}>Enter your question</div>
          <select
            className="input"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={{ width: 120 }}
          >
            <option value={15}>15 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={45}>45 seconds</option>
            <option value={60}>60 seconds</option>
            <option value={90}>90 seconds</option>
          </select>
        </div>

        <textarea
          className="input option-input"
          placeholder="Type your question here..."
          maxLength={100}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ minHeight: 80, resize: "vertical" }}
        />
        <div style={{ textAlign: "right", fontSize: 12, color: "var(--color-subtext)" }}>
          {question.length}/100
        </div>

        <div style={{ marginTop: "var(--space-4)", marginBottom: "var(--space-3)" }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: "var(--space-2)" }}>
            Edit Options
          </div>
          {options.map((opt, i) => (
            <div key={i} className="option-row">
              <input
                className="input option-input"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <div style={{ fontSize: 12, color: "var(--color-subtext)" }}>
                  Is it correct?
                </div>
                <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={`correct-selection-${i}`}
                    value={`yes-${i}`}
                    checked={selections[i] === 'yes'}
                    onChange={() => {
                      
                      setSelections((prev) => prev.map((_, idx) => (idx === i ? 'yes' : 'no')));
                      setCorrectIndex(i);
                    }}
                  />
                  Yes
                </label>
                <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={`correct-selection-no-${i}`}
                    value={`no-${i}`}
                    checked={selections[i] === 'no'}
                    onChange={() => {
                      setSelections((prev) => {
                        const copy = [...prev];
                        copy[i] = 'no';
                        return copy;
                      });
                      if (correctIndex === i) {
                        setCorrectIndex(null);
                      }
                    }}
                  />
                  No
                </label>
              </div>
            </div>
          ))}

          <PrimaryButton onClick={addOption} style={{ marginTop: "var(--space-2)" }}>
            + Add More option
          </PrimaryButton>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <PrimaryButton
            onClick={createPoll}
            disabled={!connected || !dbConnected || !question.trim() || options.some((o) => !o.trim()) || !selections.some((s) => s === 'yes')}
            style={{ marginTop: "var(--space-3)", display: "block" }}
          >
            Ask Question
          </PrimaryButton>
        </div>
        {!connected && (
          <div style={{ color: 'red', fontSize: 12, marginTop: 'var(--space-2)' }}>
            Connecting to server...
          </div>
        )}
        {connected && !dbConnected && (
          <div style={{ color: 'red', fontSize: 12, marginTop: 'var(--space-2)' }}>
            Database unavailable – polls cannot be created. Start MongoDB or check server logs.
          </div>
        )}

        <PrimaryButton onClick={fetchHistory} style={{ marginTop: "var(--space-3)" }} className="secondary-button">
          View History
        </PrimaryButton>
      </AppShell>
    );
  }

  if (ended && poll) {
    return (
      <AppShell wide>
        <HeaderBadge />

        <div style={{ marginBottom: "var(--space-3)", fontSize: 14, color: "var(--color-subtext)" }}>
          Students online: {studentCount}
        </div>

        <PollCard
          question={poll.question}
          options={poll.results}
          disabled
          showResults
        />

        <div style={{ display: 'flex', gap: '12px', marginTop: 'var(--space-4)' }}>
          <PrimaryButton onClick={resetForNewPoll} style={{}}>
            Create New Poll
          </PrimaryButton>

          <PrimaryButton onClick={fetchHistory} className="secondary-button" style={{}}>
            View History
          </PrimaryButton>
        </div>
      </AppShell>
    );
  }

    return (
      <>
        {/* show current participant count prominently */}
        <div style={{ marginBottom: "var(--space-3)", fontSize: 14, color: "var(--color-subtext)" }}>
          Students online: {studentCount}
        </div>
        <TeacherPollView
          question={poll.question}
          options={poll.results}
          onAskNewQuestion={resetForNewPoll}
        />
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
        <ChatPopup open={isChatOpen} participantCount={participants.length}>
          {(tab: 'chat' | 'participants') =>
            tab === 'chat' ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <ChatMessageList
                  messages={messages}
                  currentUserName="Teacher"
                />
                {typingIndicatorText && (
                  <div
                    style={{
                      padding: '8px 12px',
                      fontSize: 12,
                      color: 'var(--color-subtext)',
                      fontStyle: 'italic',
                      textAlign: 'left',
                    }}
                  >
                    {typingIndicatorText}
                  </div>
                )}
                <ChatInput onSend={sendChatMessage} />
              </div>
            ) : (
              <div style={{ padding: 16 }}>
                {participants.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--color-subtext)' }}>
                    No students joined yet
                  </div>
                ) : (
                  participants.map((p) => (
                    <div
                      key={p.sessionId}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 12px',
                        marginBottom: 8,
                        background: 'var(--color-bg)',
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    >
                      <span>{p.name && p.name.length ? p.name : p.sessionId.slice(0, 6)}</span>

                      <button
                        onClick={() => handleKickStudent(p.sessionId)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-primary-light)',
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: 'underline',
                        }}
                      >
                        Kick out
                      </button>
                    </div>
                  ))
                )}
              </div>
            )
          }
        </ChatPopup>
      </>
    );
}