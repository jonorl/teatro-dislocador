export default function LoadingRows() {
  return (
    <div className="space-y-3 pt-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 rounded-xl bg-slate-800/40 animate-pulse" />
      ))}
    </div>
  );
}