import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import notify from "../utils/notify";
import PanelHeader from "./UI/PanelHeader";
import InlineDeleteConfirm from "./UI/InlineDeleteConfirm";
import IconBtn from "./UI/IconBtn";
import TrashIcon from "./UI/TrashIcon";
import Drawer from "./UI/Drawer";
import LoadingRows from "./UI/LoadingRows";
import EmptyState from "./UI/EmptyState";
import PencilIcon from "./icons/PencilIcon";
import SaveBtn from "./UI/SaveBtn";
import Field from "./UI/Field";
import authHeaders from "../utils/authHeaders";
import { inputCls } from "../const/inputCLs";

interface ClassItem {
  id: string;
  title: string;
  description: string;
  schedule: string;
  image: string;
  createdAt: string;
}

interface AdminDashboardProps {
  API: string;
}

const EMPTY_CLASS = { title: "", description: "", schedule: "", image: "" };

export default function ClassesPanel({ API }: AdminDashboardProps) {
  const { getToken } = useAuth();
  const [items, setItems] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ClassItem | null>(null);
  const [form, setForm] = useState(EMPTY_CLASS);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<"url" | "file">("url");
  const [imageUploading, setImageUploading] = useState(false);
  const imageFileRef = useRef<HTMLInputElement>(null);

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
    setImageMode("url");
    setDrawerOpen(true);
  };

  const openEdit = (item: ClassItem) => {
    setEditTarget(item);
    setForm({ title: item.title, description: item.description, schedule: item.schedule, image: item.image ?? "" });
    setImageMode("url");
    setDrawerOpen(true);
  };

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
      setForm((prev) => ({ ...prev, image: url }));
    } catch (err: any) {
      notify(err.message, "err");
    } finally {
      setImageUploading(false);
    }
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-slate-100 text-sm">{item.title}</p>
                  <p className="text-xs text-rose-400/90 mt-0.5 font-medium">{item.schedule}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.description}</p>
                </div>
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
          <Field label="Imagen">
            <div className="flex gap-1 p-1 mb-2 rounded-xl bg-slate-900 w-fit">
              {(["url", "file"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setImageMode(m);
                    setForm((prev) => ({ ...prev, image: "" }));
                    if (imageFileRef.current) imageFileRef.current.value = "";
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    imageMode === m
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
                onChange={(e) => setForm({ ...form, image: e.target.value })}
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
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
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