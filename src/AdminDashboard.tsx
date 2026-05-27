import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import { useState } from "react";

type ActiveTab = "classes" | "showcase" | "gallery";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("classes");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* CASE 1: User is not logged in */}
      <SignedOut>
        <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-slate-800 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 mb-4 border border-rose-500/20">
              <span className="text-2xl font-black tracking-wider">TD</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Teatro Dislocador</h1>
            <p className="text-slate-400 mb-8 text-sm uppercase tracking-wider font-medium">Control Center</p>
            
            <SignInButton mode="modal">
              <button className="w-full bg-rose-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-rose-500 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-rose-600/20 hover:shadow-rose-500/30">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.133 1 1.18 5.925 1.18 12s4.953 11 11.06 11c6.373 0 10.596-4.414 10.596-10.74 0-.727-.078-1.282-.175-1.697H12.24z"/>
                </svg>
                Sign in with Google
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      {/* CASE 2: Authenticated View */}
      <SignedIn>
        <div className="flex min-h-screen">
          
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
            <div className="p-6 border-b border-slate-800">
              <h1 className="text-xl font-bold text-white tracking-tight">Teatro Dislocador</h1>
              <p className="text-xs text-rose-500 font-medium uppercase tracking-wider mt-0.5">Panel de Control</p>
            </div>
            
            <nav className="flex-1 p-4 space-y-1.5">
              <button
                onClick={() => setActiveTab("classes")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === "classes" 
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/10" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                Clases
              </button>

              <button
                onClick={() => setActiveTab("showcase")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === "showcase" 
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/10" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
                Cartelera (Showcase)
              </button>

              <button
                onClick={() => setActiveTab("gallery")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === "gallery" 
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/10" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Galería
              </button>
            </nav>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/50">
              <span className="text-xs text-slate-500 font-medium">Sesión activa</span>
              <UserButton afterSignOutUrl="/admin" appearance={{ elements: { avatarBox: "w-8 h-8 rounded-xl" } }} />
            </div>
          </aside>

          {/* Main Content Pane */}
          <main className="flex-1 bg-slate-950 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white capitalize">Gestionar {activeTab === "classes" ? "Clases" : activeTab === "showcase" ? "Cartelera" : "Galería"}</h2>
                <p className="text-sm text-slate-400 mt-1">Añade o modifica los elementos expuestos en la web principal.</p>
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl shadow-black/20">
                {activeTab === "classes" && <ClassForm />}
                {activeTab === "showcase" && <ShowcaseForm />}
                {activeTab === "gallery" && <GalleryForm />}
              </div>

            </div>
          </main>

        </div>
      </SignedIn>
    </div>
  );
}

const inputStyle = "w-full p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 outline-none transition duration-150 text-sm";
const labelStyle = "block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5";

function ClassForm() {
  const { getToken } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch("http://127.0.0.1:3000/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ title, description, schedule })
      });

      if (response.ok) {
        alert("¡Clase guardada con éxito!");
        setTitle(""); setDescription(""); setSchedule("");
      } else {
        const err = await response.json();
        alert(`Error: ${err.error || "Fallo del servidor"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelStyle}>Nombre de la clase</label>
        <input type="text" placeholder="Ej: Iniciación al Teatro" value={title} onChange={e => setTitle(e.target.value)} required className={inputStyle} />
      </div>
      <div>
        <label className={labelStyle}>Horario</label>
        <input type="text" placeholder="Ej: Lunes y Miércoles 19:00 - 21:00" value={schedule} onChange={e => setSchedule(e.target.value)} required className={inputStyle} />
      </div>
      <div>
        <label className={labelStyle}>Descripción</label>
        <textarea placeholder="Detalles de la materia, profesores..." value={description} onChange={e => setDescription(e.target.value)} required className={`${inputStyle} h-32 resize-none`} />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold p-3 rounded-xl transition duration-150 disabled:opacity-50">
        {loading ? "Guardando..." : "Crear Nueva Clase"}
      </button>
    </form>
  );
}

function ShowcaseForm() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", author: "", director: "", dates: "", duration: "", description: "", image: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch("http://127.0.0.1:3000/api/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        alert("¡Obra añadida a la cartelera!");
        setForm({ title: "", author: "", director: "", dates: "", duration: "", description: "", image: "" });
      } else {
        const err = await response.json();
        alert(`Error: ${err.error || "Fallo del servidor"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>Título de la obra</label>
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className={inputStyle} />
        </div>
        <div>
          <label className={labelStyle}>Imagen (URL de portada)</label>
          <input type="url" placeholder="https://..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} required className={inputStyle} />
        </div>
        <div>
          <label className={labelStyle}>Autor</label>
          <input type="text" value={form.author} onChange={e => setForm({...form, author: e.target.value})} required className={inputStyle} />
        </div>
        <div>
          <label className={labelStyle}>Director</label>
          <input type="text" value={form.director} onChange={e => setForm({...form, director: e.target.value})} required className={inputStyle} />
        </div>
        <div>
          <label className={labelStyle}>Fechas / Funciones</label>
          <input type="text" placeholder="Ej: Del 14 al 20 de Octubre" value={form.dates} onChange={e => setForm({...form, dates: e.target.value})} required className={inputStyle} />
        </div>
        <div>
          <label className={labelStyle}>Duración</label>
          <input type="text" placeholder="Ej: 90 min" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} required className={inputStyle} />
        </div>
      </div>
      <div>
        <label className={labelStyle}>Sinopsis / Descripción larga</label>
        <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required className={`${inputStyle} h-28 resize-none`} />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold p-3 rounded-xl transition duration-150 disabled:opacity-50">
        {loading ? "Publicando..." : "Publicar en Cartelera"}
      </button>
    </form>
  );
}

function GalleryForm() {
  const { getToken } = useAuth();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch("http://127.0.0.1:3000/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ url })
      });
      if (response.ok) {
        alert("¡Imagen indexada en la galería!");
        setUrl("");
      } else {
        const err = await response.json();
        alert(`Error: ${err.error || "Fallo del servidor"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelStyle}>URL de la Imagen fija</label>
        <input type="url" placeholder="https://images.unsplash.com/... o CDN url" value={url} onChange={e => setUrl(e.target.value)} required className={inputStyle} />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold p-3 rounded-xl transition duration-150 disabled:opacity-50">
        {loading ? "Añadiendo..." : "Añadir a la Galería"}
      </button>
    </form>
  );
}