import { useState, useEffect } from "react";


interface ToastItem {
  id: number;
  msg: string;
  type: "ok" | "err";
}

export default function ToastRegion() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { msg, type } = (e as CustomEvent).detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, msg, type }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        3500
      );
    };
    window.addEventListener("td:toast", handler);
    return () => window.removeEventListener("td:toast", handler);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            px-4 py-3 rounded-xl shadow-2xl text-sm font-medium
            flex items-center gap-2.5 border
            ${
              t.type === "err"
                ? "bg-red-950 border-red-800/60 text-red-200"
                : "bg-slate-800 border-slate-700/50 text-slate-100"
            }
          `}
          style={{ animation: "tdFadeUp 0.2s ease-out" }}
        >
          <span>{t.type === "err" ? "✕" : "✓"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}