import { useState } from "react";
import AppShell from "../components/AppShell";
import HeaderBadge from "../components/HeaderBadge";
import PrimaryButton from "../components/PrimaryButton";

type Props = {
  onSelect: (role: "teacher" | "student") => void;
};

export default function RoleSelection({ onSelect }: Props) {
  const [role, setRole] = useState<"teacher" | "student" | null>(null);

  const Card = ({
    title,
    description,
    icon,
    selected,
    onClick,
  }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    selected: boolean;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      className={`card${selected ? " selected" : ""}`}
      style={{ flex: 1 }}
    >
      {icon}
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: "var(--color-subtext)" }}>{description}</div>
    </div>
  );

  return (
    <AppShell>
      <HeaderBadge />

      <div style={{ textAlign: "center", marginBottom: "var(--space-5)" }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>
          Welcome to the Live Polling System
        </div>
        <div style={{ fontSize: 14, color: "var(--color-subtext)", marginTop: 6 }}>
          Please select the role that best describes you to begin using the live
          polling system
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-5)" }}>
        <Card
          icon={<span style={{ fontSize: 32 }} role="img" aria-label="student">👩‍🎓</span>}
          title="I’m a Student"
          description="Submit answers and view results in real-time"
          selected={role === "student"}
          onClick={() => setRole("student")}
        />

        <Card
          icon={<span style={{ fontSize: 32 }} role="img" aria-label="teacher">👨‍🏫</span>}
          title="I’m a Teacher"
          description="Create polls and monitor responses in real-time"
          selected={role === "teacher"}
          onClick={() => setRole("teacher")}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <PrimaryButton
          disabled={!role}
          onClick={() => role && onSelect(role)}
          style={{ width: 200 }}
        >
          Continue
        </PrimaryButton>
      </div>
    </AppShell>
  );
}