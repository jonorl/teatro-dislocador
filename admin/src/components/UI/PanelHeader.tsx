export default function PanelHeader({
  title,
  count,
  onNew,
}: {
  title: string;
  count?: number;
  onNew?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <h2
          className="text-xl font-bold text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h2>
        {count !== undefined && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/40">
            {count}
          </span>
        )}
      </div>
      {onNew && (
        <button
          onClick={onNew}
          className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition shadow-sm shadow-rose-700/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo
        </button>
      )}
    </div>
  );
}