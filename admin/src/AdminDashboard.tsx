import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";
import { useState, useEffect, useCallback } from "react";

const API = "http://127.0.0.1:3000/api";

interface ClassItem {
  id: string;
  title: string;
  description: string;
  schedule: string;
  createdAt: string;
}

interface ShowcaseItem {
  id: string;
  title: string;
  author: string;
  director: string;
  dates: string;
  duration: string;
  description: string;
  image: string;
}

interface GalleryItem {
  id: string;
  url: string;
}

type Tab = "classes" | "showcase" | "gallery";

// ─────────────────────────────────────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────────────────────────────────────

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Toast system (module-level, no context needed)
// ─────────────────────────────────────────────────────────────────────────────

function notify(msg: string, type: "ok" | "err" = "ok") {
  window.dispatchEvent(
    new CustomEvent("td:toast", { detail: { msg, type } })
  );
}

interface ToastItem {
  id: number;
  msg: string;
  type: "ok" | "err";
}

function ToastRegion() {
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

// ─────────────────────────────────────────────────────────────────────────────
// Shared form atoms
// ─────────────────────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/60 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/30 outline-none transition";

const labelCls =
  "block text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function SaveBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full mt-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3 rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Guardando..." : label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI: Side Drawer
// ─────────────────────────────────────────────────────────────────────────────

function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
      />
      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-lg bg-slate-900 border-l border-slate-800 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 shrink-0">
          <h3
            className="text-lg font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI: Misc
// ─────────────────────────────────────────────────────────────────────────────

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700/40 flex items-center justify-center mb-4">
        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-slate-500 text-sm">{label}</p>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-3 pt-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 rounded-xl bg-slate-800/40 animate-pulse" />
      ))}
    </div>
  );
}

function PanelHeader({
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

function IconBtn({
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

function InlineDeleteConfirm({
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

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────

function PencilIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: Classes
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_CLASS = { title: "", description: "", schedule: "" };

function ClassesPanel() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ClassItem | null>(null);
  const [form, setForm] = useState(EMPTY_CLASS);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetch(`${API}/classes`).then((r) => r.json());
      setItems(data.classes ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_CLASS);
    setDrawerOpen(true);
  };

  const openEdit = (item: ClassItem) => {
    setEditTarget(item);
    setForm({ title: item.title, description: item.description, schedule: item.schedule });
    setDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();
      const url = editTarget ? `${API}/classes/${editTarget.id}` : `${API}/classes`;
      const method = editTarget ? "PUT" : "POST";
      const r = await fetch(url, {
        method,
        headers: authHeaders(token!),
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? "Error del servidor");
      notify(editTarget ? "Clase actualizada" : "Clase creada");
      setDrawerOpen(false);
      load();
    } catch (err: any) {
      notify(err.message, "err");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: String) => {
    try {
      const token = await getToken();
      const r = await fetch(`${API}/classes/${id}`, {
        method: "DELETE",
        headers: authHeaders(token!),
      });
      if (!r.ok && r.status !== 204)
        throw new Error("Error al eliminar");
      notify("Clase eliminada");
      load();
    } catch (err: any) {
      notify(err.message, "err");
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <>
      <PanelHeader title="Clases" count={items.length} onNew={openCreate} />

      {loading ? (
        <LoadingRows />
      ) : items.length === 0 ? (
        <EmptyState label="No hay clases todavía. ¡Crea la primera!" />
      ) : (
        <div className="divide-y divide-slate-800/60">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between py-4 gap-4 hover:bg-slate-800/20 px-2 rounded-xl -mx-2 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-100 text-sm">{item.title}</p>
                <p className="text-xs text-rose-400/90 mt-0.5 font-medium">{item.schedule}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                {confirmDelete === item.id ? (
                  <InlineDeleteConfirm
                    label="¿Confirmar?"
                    onConfirm={() => handleDelete(item.id)}
                    onCancel={() => setConfirmDelete(null)}
                  />
                ) : (
                  <>
                    <IconBtn title="Editar" onClick={() => openEdit(item)}>
                      <PencilIcon />
                    </IconBtn>
                    <IconBtn
                      title="Eliminar"
                      onClick={() => setConfirmDelete(item.id)}
                      danger
                    >
                      <TrashIcon />
                    </IconBtn>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editTarget ? "Editar Clase" : "Nueva Clase"}
      >
        <form onSubmit={handleSave} className="space-y-5">
          <Field label="Nombre de la clase">
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ej: Iniciación al Teatro"
              required
            />
          </Field>
          <Field label="Horario">
            <input
              className={inputCls}
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
              placeholder="Ej: Lunes y Miércoles 19:00–21:00"
              required
            />
          </Field>
          <Field label="Descripción">
            <textarea
              className={`${inputCls} h-36 resize-none`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detalles de la materia, profesores..."
              required
            />
          </Field>
          <SaveBtn
            loading={saving}
            label={editTarget ? "Guardar cambios" : "Crear clase"}
          />
        </form>
      </Drawer>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: Showcase
// ─────────────────────────────────────────────────────────────────────────────

type ShowcaseForm = Omit<ShowcaseItem, "id">;

const EMPTY_SHOW: ShowcaseForm = {
  title: "",
  author: "",
  director: "",
  dates: "",
  duration: "",
  description: "",
  image: "",
};

function ShowcasePanel() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ShowcaseItem | null>(null);
  const [form, setForm] = useState<ShowcaseForm>(EMPTY_SHOW);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetch(`${API}/showcase`).then((r) => r.json());
      setItems(data.cartelera ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_SHOW);
    setDrawerOpen(true);
  };

  const openEdit = (item: ShowcaseItem) => {
    setEditTarget(item);
    const { id, ...rest } = item;
    setForm(rest);
    setDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();
      const url = editTarget ? `${API}/showcase/${editTarget.id}` : `${API}/showcase`;
      const method = editTarget ? "PUT" : "POST";
      const r = await fetch(url, {
        method,
        headers: authHeaders(token!),
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? "Error del servidor");
      notify(editTarget ? "Obra actualizada" : "Obra publicada en cartelera");
      setDrawerOpen(false);
      load();
    } catch (err: any) {
      notify(err.message, "err");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: String) => {
    try {
      const token = await getToken();
      const r = await fetch(`${API}/showcase/${id}`, {
        method: "DELETE",
        headers: authHeaders(token!),
      });
      if (!r.ok && r.status !== 204)
        throw new Error("Error al eliminar");
      notify("Obra eliminada");
      load();
    } catch (err: any) {
      notify(err.message, "err");
    } finally {
      setConfirmDelete(null);
    }
  };

  const f = (key: keyof ShowcaseForm, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <>
      <PanelHeader title="Cartelera" count={items.length} onNew={openCreate} />

      {loading ? (
        <LoadingRows />
      ) : items.length === 0 ? (
        <EmptyState label="No hay obras en cartelera." />
      ) : (
        <div className="divide-y divide-slate-800/60">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between py-4 gap-4 hover:bg-slate-800/20 px-2 rounded-xl -mx-2 transition-colors"
            >
              <div className="flex gap-3 min-w-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-[68px] object-cover rounded-lg shrink-0 border border-slate-700/40"
                  />
                ) : (
                  <div className="w-12 h-[68px] rounded-lg shrink-0 bg-slate-800 border border-slate-700/40 flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" />
                    </svg>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-slate-100 text-sm truncate">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {item.author}
                    {item.director && (
                      <> · <span className="text-slate-500">Dir. {item.director}</span></>
                    )}
                  </p>
                  <p className="text-xs text-rose-400/80 mt-0.5">{item.dates} · {item.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 pt-1">
                {confirmDelete === item.id ? (
                  <InlineDeleteConfirm
                    label="¿Confirmar?"
                    onConfirm={() => handleDelete(item.id)}
                    onCancel={() => setConfirmDelete(null)}
                  />
                ) : (
                  <>
                    <IconBtn title="Editar" onClick={() => openEdit(item)}>
                      <PencilIcon />
                    </IconBtn>
                    <IconBtn
                      title="Eliminar"
                      onClick={() => setConfirmDelete(item.id)}
                      danger
                    >
                      <TrashIcon />
                    </IconBtn>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editTarget ? "Editar Obra" : "Nueva Obra"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Título">
              <input
                className={inputCls}
                value={form.title}
                onChange={(e) => f("title", e.target.value)}
                required
              />
            </Field>
            <Field label="Duración">
              <input
                className={inputCls}
                value={form.duration}
                onChange={(e) => f("duration", e.target.value)}
                placeholder="Ej: 90 min"
                required
              />
            </Field>
            <Field label="Autor">
              <input
                className={inputCls}
                value={form.author}
                onChange={(e) => f("author", e.target.value)}
                required
              />
            </Field>
            <Field label="Director">
              <input
                className={inputCls}
                value={form.director}
                onChange={(e) => f("director", e.target.value)}
                required
              />
            </Field>
          </div>
          <Field label="Fechas / Funciones">
            <input
              className={inputCls}
              value={form.dates}
              onChange={(e) => f("dates", e.target.value)}
              placeholder="Ej: Del 14 al 20 de Octubre"
              required
            />
          </Field>
          <Field label="Imagen de portada (URL)">
            <input
              type="url"
              className={inputCls}
              value={form.image}
              onChange={(e) => f("image", e.target.value)}
              placeholder="https://..."
              required
            />
            {form.image && (
              <div className="mt-2 h-28 rounded-xl overflow-hidden border border-slate-700/40 bg-slate-950">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </Field>
          <Field label="Sinopsis">
            <textarea
              className={`${inputCls} h-28 resize-none`}
              value={form.description}
              onChange={(e) => f("description", e.target.value)}
              required
            />
          </Field>
          <SaveBtn
            loading={saving}
            label={editTarget ? "Guardar cambios" : "Publicar en cartelera"}
          />
        </form>
      </Drawer>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: Gallery
// ─────────────────────────────────────────────────────────────────────────────

function GalleryPanel() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetch(`${API}/gallery`).then((r) => r.json());
      // Normalize response – backend currently returns { id?, URL?, url? }
      // After applying the backend fix, both id and url will be present.
      const normalized: GalleryItem[] = (data.galeria ?? []).map(
        (item: any) => ({
          id: item.id ?? "",
          url: item.url ?? item.URL ?? "",
        })
      );
      setItems(normalized);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();
      const r = await fetch(`${API}/gallery`, {
        method: "POST",
        headers: authHeaders(token!),
        body: JSON.stringify({ url }),
      });
      if (!r.ok) throw new Error((await r.json()).error ?? "Error");
      notify("Imagen añadida a la galería");
      setUrl("");
      load();
    } catch (err: any) {
      notify(err.message, "err");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: String) => {
    try {
      const token = await getToken();
      const r = await fetch(`${API}/gallery/${id}`, {
        method: "DELETE",
        headers: authHeaders(token!),
      });
      if (!r.ok && r.status !== 204)
        throw new Error("Error al eliminar");
      notify("Imagen eliminada");
      load();
    } catch (err: any) {
      notify(err.message, "err");
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <>
      <PanelHeader title="Galería" count={items.length} />

      {/* Add image form – inline (single field, no drawer needed) */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60">
        <p className={labelCls}>Añadir imagen por URL</p>
        <form onSubmit={handleAdd} className="flex gap-2.5">
          <input
            type="url"
            className={`${inputCls} flex-1`}
            placeholder="https://cdn.ejemplo.com/foto.jpg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="shrink-0 bg-rose-600 hover:bg-rose-500 text-white font-semibold px-4 py-2.5 rounded-xl transition text-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {saving ? "..." : "Añadir"}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-slate-800/40 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState label="La galería está vacía." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden border border-slate-800/60 bg-slate-900 aspect-[4/3]"
            >
              <img
                src={item.url}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200">
                {confirmDelete === item.id ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-3">
                    <p className="text-xs text-slate-300 mb-2.5 font-medium">¿Eliminar esta imagen?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-500 transition font-semibold"
                      >
                        Sí, eliminar
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-xs px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(item.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-red-600 text-white p-1.5 rounded-lg"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar tab definitions
// ─────────────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "classes",
    label: "Clases",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: "showcase",
    label: "Cartelera",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    id: "gallery",
    label: "Galería",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Login screen
// ─────────────────────────────────────────────────────────────────────────────

function LoginScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-rose-600 flex items-center justify-center mb-5 shadow-xl shadow-rose-600/30">
            <span
              className="text-xl font-black text-white tracking-wider"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              TD
            </span>
          </div>
          <h1
            className="text-3xl font-black text-white text-center leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Teatro<br />Dislocador
          </h1>
          <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-[0.25em] mt-2.5">
            Panel de Control
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
          <p className="text-sm text-slate-400 text-center mb-6">
            Accede con tu cuenta de administrador.
          </p>
          <SignInButton mode="modal">
            <button className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 px-4 rounded-xl transition text-sm shadow-md">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.133 1 1.18 5.925 1.18 12s4.953 11 11.06 11c6.373 0 10.596-4.414 10.596-10.74 0-.727-.078-1.282-.175-1.697H12.24z" />
              </svg>
              Continuar con Google
            </button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root component
// ─────────────────────────────────────────────────────────────────────────────

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
                {tab === "classes"  && <ClassesPanel />}
                {tab === "showcase" && <ShowcasePanel />}
                {tab === "gallery"  && <GalleryPanel />}
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