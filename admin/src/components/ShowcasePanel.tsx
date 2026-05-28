import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import authHeaders from "../utils/authHeaders";
import notify from "../utils/notify";
import PanelHeader from "./UI/PanelHeader";
import LoadingRows from "./UI/LoadingRows";
import EmptyState from "./UI/EmptyState";
import InlineDeleteConfirm from "./UI/InlineDeleteConfirm";
import IconBtn from "./UI/IconBtn";
import PencilIcon from "./icons/PencilIcon";
import TrashIcon from "./UI/TrashIcon";
import Field from "./UI/Field";
import Drawer from "./UI/Drawer";
import SaveBtn from "./UI/SaveBtn";
import { inputCls } from "../const/inputCLs";

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

type ShowcaseForm = Omit<ShowcaseItem, "id">;

interface AdminDashboardProps {
  API: string;
}

const EMPTY_SHOW: ShowcaseForm = {
  title: "",
  author: "",
  director: "",
  dates: "",
  duration: "",
  description: "",
  image: "",
};

export default function ShowcasePanel({ API }: AdminDashboardProps) {
  const { getToken } = useAuth();
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ShowcaseItem | null>(null);
  const [form, setForm] = useState<ShowcaseForm>(EMPTY_SHOW);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Inside ShowcasePanel, add alongside other state:
  const [imageMode, setImageMode] = useState<"url" | "file">("url");
  const [imageUploading, setImageUploading] = useState(false);
  const imageFileRef = useRef<HTMLInputElement>(null);

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("image", file);
      const r = await fetch(`${API}/upload`, {
        method: "POST",
        headers: authHeaders(token!, true),
        body: fd,
      });
      if (!r.ok) throw new Error((await r.json()).error ?? "Error al subir");
      const { url } = await r.json();
      f("image", url); // drops straight into the existing form.image field
    } catch (err: any) {
      notify(err.message, "err");
    } finally {
      setImageUploading(false);
    }
  };

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
          <Field label="Imagen de portada">
            {/* Mode toggle */}
            <div className="flex gap-1 p-1 mb-2 rounded-xl bg-slate-900 w-fit">
              {(["url", "file"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setImageMode(m);
                    f("image", "");
                    if (imageFileRef.current) imageFileRef.current.value = "";
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${imageMode === m
                      ? "bg-rose-600 text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                >
                  {m === "url" ? "URL" : "Desde PC"}
                </button>
              ))}
            </div>

            {imageMode === "url" ? (
              <input
                type="url"
                className={inputCls}
                value={form.image}
                onChange={(e) => f("image", e.target.value)}
                placeholder="https://..."
              />
            ) : (
              <label className="flex items-center gap-2 cursor-pointer border border-slate-700 rounded-xl px-3 py-2.5 bg-slate-900 hover:border-slate-500 transition text-sm text-slate-400">
                {imageUploading ? (
                  <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                )}
                <span className="truncate">
                  {imageUploading ? "Subiendo…" : (form.image ? "Cambiar imagen" : "Elegir imagen…")}
                </span>
                <input
                  ref={imageFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  onChange={handleImageFile}
                />
              </label>
            )}

            {form.image && (
              <div className="mt-2 h-28 rounded-xl overflow-hidden border border-slate-700/40 bg-slate-950">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")} />
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