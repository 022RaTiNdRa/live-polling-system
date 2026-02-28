import AppShell from "./AppShell";
import HeaderBadge from "./HeaderBadge";
import PrimaryButton from "./PrimaryButton";

type Option = {
  optionId: string;
  text: string;
  count: number;
  percentage: number;
};

type Poll = {
  _id: string;
  question: string;
  results: Option[];
};

type Props = {
  polls: Poll[];
  onBack: () => void;
};

export default function PollHistoryView({ polls, onBack }: Props) {
  return (
    <AppShell wide>
      <HeaderBadge />

      <div style={{ marginBottom: "var(--space-5)", fontSize: 20, fontWeight: 700 }}>
        View Poll History
      </div>

      <div style={{ maxHeight: 800, overflowY: "auto", paddingRight: "var(--space-3)" }}>
        {polls.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--color-subtext)", padding: "var(--space-5)" }}>
            No polls yet
          </div>
        ) : (
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {polls.map((poll, idx) => (
              <div key={poll._id} style={{ width: '100%', maxWidth: 'none' }}>
                <div style={{ borderRadius: 8, border: '1px solid #e0e0e0', overflow: 'hidden', background: 'white' }}>
                  <div style={{ background: '#3a3a3a', color: '#fff', padding: '18px 28px', fontSize: 16, fontWeight: 600 }}>
                    {poll.question}
                  </div>

                  <div style={{ padding: '32px 28px' }}>
                    {poll.results.map((o, j) => (
                      <div key={o.optionId} style={{ marginBottom: j < poll.results.length - 1 ? 28 : 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                          <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: 18,
                            flexShrink: 0,
                          }}>
                            {j + 1}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                              <div style={{ fontSize: 15, color: '#222', fontWeight: 500 }}>{o.text}</div>
                              <div style={{ fontSize: 15, fontWeight: 700, color: '#333', minWidth: '45px', textAlign: 'right' }}>{o.percentage}%</div>
                            </div>

                            <div style={{ background: '#f0f0f0', borderRadius: 3, overflow: 'hidden', height: 32, position: 'relative' }}>
                              <div style={{ 
                                width: `${o.percentage}%`, 
                                height: '100%', 
                                background: '#6366f1',
                                borderRadius: 3,
                                transition: 'width 0.3s ease'
                              }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PrimaryButton onClick={onBack} style={{ marginTop: "var(--space-5)" }}>
        Back to Dashboard
      </PrimaryButton>
    </AppShell>
  );
}
