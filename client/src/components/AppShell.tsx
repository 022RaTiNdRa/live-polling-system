type Props = {
  children: React.ReactNode;
  wide?: boolean;
};

export default function AppShell({ children, wide = false }: Props) {
  const inlineWide =
    wide
      ? { width: "100%", minWidth: 600, margin: "0 auto", padding: "0 20px" }
      : undefined;

  return (
    <div className="app-shell-wrapper" style={wide ? { alignItems: "flex-start" } : undefined}>
      <div className={"app-shell" + (wide ? " app-shell--wide" : "")} style={inlineWide}>
        {children}
      </div>
    </div>
  );
}
