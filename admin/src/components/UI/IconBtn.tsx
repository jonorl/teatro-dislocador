export default function IconBtn({
  children,
  onClick,
  title,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-lg transition ${
        danger
          ? "text-slate-600 hover:text-red-400 hover:bg-red-500/10"
          : "text-slate-600 hover:text-slate-200 hover:bg-slate-700/60"
      }`}
    >
      {children}
    </button>
  );
}