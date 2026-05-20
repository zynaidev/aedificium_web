export default function Container({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "0 32px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
