export default function ClientiWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-[72px]" style={{ backgroundColor: "#fafaf8" }}>
      {children}
    </div>
  );
}
