type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

export default function PrimaryButton({
  children,
  onClick,
  disabled,
  style,
  className,
}: Props) {
  const classNames = ["primary-button"];
  if (disabled) classNames.push("disabled");
  if (style && (style as any).width === "100%") classNames.push("full-width");
  if (className) classNames.push(className);

  return (
    <button onClick={onClick} disabled={disabled} className={classNames.join(" ")} style={style}>
      {children}
    </button>
  );
}