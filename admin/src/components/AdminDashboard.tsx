import { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import LoginScreen from "./LoginScreen";
import { TABS } from "../const/Tabs"
import ClassesPanel from "./ClassesPanel";
import GalleryPanel from "./GalleryPanel";
import ShowcasePanel from "./ShowcasePanel";
import ToastRegion from "./ToastItem";

type Tab = "classes" | "showcase" | "gallery";

const isProd = import.meta.env.MODE;

const API = isProd
  ? import.meta.env.VITE_DISLOCADOR_PROD_BACKEND
  : import.meta.env.VITE_DISLOCADOR_DEV_BACKEND;

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("classes");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [tab]);

  // Close sidebar on outside click (desktop overlay isn't rendered, but safety net)
  useEffect(() => {
    if (!sidebarOpen) return;
    const handler = (e: MouseEvent) => {
      const sidebar = document.getElementById("td-sidebar");
      if (sidebar && !sidebar.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sidebarOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes tdFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tdSlideIn {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        .td-sidebar-open { animation: tdSlideIn 0.22s ease-out; }
      `}</style>

      <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <SignedOut>
          <LoginScreen />
        </SignedOut>

        <SignedIn>
          <div className="flex min-h-screen">

            {/* ─── Mobile overlay backdrop ─── */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* ─── Sidebar ─── */}
            <aside
              id="td-sidebar"
              className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col
                transform transition-transform duration-200 ease-out
                lg:relative lg:translate-x-0 lg:w-60 lg:shrink-0
                ${sidebarOpen ? "translate-x-0 td-sidebar-open" : "-translate-x-full"}
              `}
            >
              {/* Logo */}
              <div className="px-5 py-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  {/* Replace this container with your image */}
                  <img
                    src="/logo.jpg"
                    alt="Teatro Dislocador Logo"
                    className="w-9 h-9 rounded-xl object-cover shrink-0 shadow-md shadow-rose-700/30"
                  />

                  <div className="min-w-0">
                    <p
                      className="text-sm font-bold text-white leading-tight truncate"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Teatro Dislocador
                    </p>
                    <p className="text-[9px] font-semibold text-rose-400/80 uppercase tracking-widest mt-0.5">
                      Panel de Control
                    </p>
                  </div>
                  {/* Close button (mobile only) */}
                  <button
                    className="ml-auto lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Nav */}
              <nav className="flex-1 p-3 space-y-0.5">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.id
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/70"
                      }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </nav>

              {/* User footer */}
              <div className="p-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium select-none">
                  Sesión activa
                </span>
                <UserButton
                  afterSignOutUrl="/admin"
                  appearance={{ elements: { avatarBox: "w-7 h-7 rounded-lg" } }}
                />
              </div>
            </aside>

            {/* ─── Main content ─── */}
            <div className="flex-1 flex flex-col min-w-0">

              {/* ─── Mobile top bar ─── */}
              <header className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-slate-900/95 backdrop-blur border-b border-slate-800">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>TD</span>
                  </div>
                  <span className="text-sm font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {TABS.find(t => t.id === tab)?.label ?? "Panel"}
                  </span>
                </div>
                <div className="ml-auto">
                  <UserButton
                    afterSignOutUrl="/admin"
                    appearance={{ elements: { avatarBox: "w-7 h-7 rounded-lg" } }}
                  />
                </div>
              </header>

              {/* ─── Content ─── */}
              <main className="flex-1 overflow-y-auto bg-slate-950 pb-20 lg:pb-0">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                  {tab === "classes" && <ClassesPanel API={API} />}
                  {tab === "showcase" && <ShowcasePanel API={API} />}
                  {tab === "gallery" && <GalleryPanel API={API} />}
                </div>
              </main>

              {/* ─── Mobile bottom nav ─── */}
              <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-slate-900/95 backdrop-blur border-t border-slate-800 flex">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors ${tab === t.id
                        ? "text-rose-400"
                        : "text-slate-500 hover:text-slate-300"
                      }`}
                  >
                    <span className={`transition-transform ${tab === t.id ? "scale-110" : ""}`}>
                      {t.icon}
                    </span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </SignedIn>
      </div>

      {/* Global toast region – rendered outside the main tree so z-index is clean */}
      <ToastRegion />
    </>
  );
}