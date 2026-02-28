import { useState } from "react";
import AppShell from "./AppShell";
import HeaderBadge from "./HeaderBadge";
import PrimaryButton from "./PrimaryButton";

type Props = {
  onSubmit: (name: string) => void;
};

export default function StudentOnboarding({ onSubmit }: Props) {
  const [name, setName] = useState("");

  return (
    <AppShell>
      <HeaderBadge />

      <div style={{ textAlign: "center", marginBottom: "var(--space-5)" }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Let’s Get Started</div>
        <div style={{ fontSize: 14, color: "var(--color-subtext)", marginTop: 6 }}>
          Enter your name to participate in the live poll
        </div>
      </div>

      <input
        className="input"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <PrimaryButton
          disabled={!name.trim()}
          onClick={() => onSubmit(name)}
          style={{ width: 200 }}
        >
          Continue
        </PrimaryButton>
      </div>
    </AppShell>
  );
}