import { useState } from "react";
import { SignedIn, SignedOut, UserButton} from "@clerk/clerk-react";
import LoginScreen from "./LoginScreen";
import { TABS } from "../const/Tabs"
import ClassesPanel from "./ClassesPanel";
import GalleryPanel from "./GalleryPanel";
import ShowcasePanel from "./ShowcasePanel";
import ToastRegion from "./ToastItem";

type Tab = "classes" | "showcase" | "gallery";

const isProd = import.meta.env.PROD; 

const API = isProd
  ? import.meta.env.VITE_DISLOCADOR_PROD_BACKEND
  : import.meta.env.VITE_DISLOCADOR_DEV_BACKEND;

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("classes");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes tdFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <SignedOut>
          <LoginScreen />
        </SignedOut>

        <SignedIn>
          <div className="flex min-h-screen">
            {/* ─── Sidebar ─── */}
            <aside className="w-60 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
              {/* Logo */}
              <div className="px-5 py-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center shrink-0 shadow-md shadow-rose-700/30">
                    <span
                      className="text-xs font-black text-white tracking-wider"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      TD
                    </span>
                  </div>
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
                </div>
              </div>

              {/* Nav */}
              <nav className="flex-1 p-3 space-y-0.5">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      tab === t.id
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
            <main className="flex-1 overflow-y-auto bg-slate-950">
              <div className="max-w-3xl mx-auto px-8 py-10">
                {tab === "classes"  && <ClassesPanel API={API}/>}
                {tab === "showcase" && <ShowcasePanel API={API}/>}
                {tab === "gallery"  && <GalleryPanel API={API}/>}
              </div>
            </main>
          </div>
        </SignedIn>
      </div>

      {/* Global toast region – rendered outside the main tree so z-index is clean */}
      <ToastRegion />
    </>
  );
}