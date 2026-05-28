export default function InlineDeleteConfirm({
  label,
  onConfirm,
  onCancel,
}: {
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">{label}</span>
      <button
        onClick={onConfirm}
        className="text-xs px-2.5 py-1 rounded-lg bg-red-600 text-white hover:bg-red-500 transition font-medium"
      >
        Eliminar
      </button>
      <button
        onClick={onCancel}
        className="text-xs px-2.5 py-1 rounded-lg bg-slate-700/60 text-slate-300 hover:bg-slate-700 transition"
      >
        Cancelar
      </button>
    </div>
  );
}