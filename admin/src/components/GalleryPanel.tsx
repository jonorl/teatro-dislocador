import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import authHeaders from "../utils/authHeaders";
import notify from "../utils/notify";
import TrashIcon from "./UI/TrashIcon";
import EmptyState from "./UI/EmptyState";
import PanelHeader from "./UI/PanelHeader";
import { labelCls } from "../const/labelCls";
import { inputCls } from "../const/inputCLs";

interface GalleryItem { id: string; url: string; }
interface AdminDashboardProps { API: string; }

export default function GalleryPanel({ API }: AdminDashboardProps) {
  const { getToken } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"url" | "file">("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [zoomed, setZoomed] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetch(`${API}/gallery`).then((r) => r.json());
      const normalized: GalleryItem[] = (data.galeria ?? []).map((item: any) => ({
        id: item.id ?? "",
        url: item.url ?? item.URL ?? "",
      }));
      setItems(normalized);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [API]);

  useEffect(() => { load(); }, [load]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const resetForm = () => {
    setUrl("");
    setFile(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();

      if (mode === "url") {
        const r = await fetch(`${API}/gallery`, {
          method: "POST",
          headers: authHeaders(token!),
          body: JSON.stringify({ url }),
        });
        if (!r.ok) throw new Error((await r.json()).error ?? "Error");
      } else {
        if (!file) throw new Error("Seleccioná un archivo.");
        const fd = new FormData();
        fd.append("image", file);
        const r = await fetch(`${API}/gallery/upload`, {
          method: "POST",
          headers: authHeaders(token!, true),
          body: fd,
        });
        if (!r.ok) throw new Error((await r.json()).error ?? "Error");
      }

      notify("Imagen añadida a la galería");
      resetForm();
      load();
    } catch (err: any) {
      notify(err.message, "err");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      const r = await fetch(`${API}/gallery/${id}`, {
        method: "DELETE",
        headers: authHeaders(token!),
      });
      if (!r.ok && r.status !== 204) throw new Error("Error al eliminar");
      notify("Imagen eliminada");
      load();
    } catch (err: any) {
      notify(err.message, "err");
    } finally {
      setConfirmDelete(null);
    }
  };

  const tabCls = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition touch-manipulation ${active
      ? "bg-rose-600 text-white"
      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
    }`;

  return (
    <>
      <PanelHeader title="Galería" count={items.length} />

      {/* Add image panel */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60">
        <div className="flex items-center justify-between mb-3 gap-2">
          <p className={labelCls}>Añadir imagen</p>
          <div className="flex gap-1 p-1 rounded-xl bg-slate-900 shrink-0">
            <button type="button" className={tabCls(mode === "url")} onClick={() => setMode("url")}>
              URL
            </button>
            <button type="button" className={tabCls(mode === "file")} onClick={() => setMode("file")}>
              Desde PC
            </button>
          </div>
        </div>

        <form onSubmit={handleAdd} className="flex flex-col gap-2.5">
          {mode === "url" ? (
            /* On mobile, stack input and button vertically */
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="url"
                className={`${inputCls} flex-1`}
                placeholder="https://cdn.ejemplo.com/foto.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                inputMode="url"
                autoCapitalize="none"
              />
              <SubmitBtn saving={saving} />
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                <label className="flex-1 flex items-center gap-2 cursor-pointer border border-slate-700 rounded-xl px-3 py-3 bg-slate-900 hover:border-slate-500 active:bg-slate-800 transition text-sm text-slate-400 touch-manipulation">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="truncate">{file ? file.name : "Elegir imagen…"}</span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    onChange={handleFileChange}
                    required
                  />
                </label>
                <SubmitBtn saving={saving} />
              </div>

              {preview && (
                <div className="h-32 rounded-xl overflow-hidden border border-slate-700/40 bg-slate-950">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </>
          )}
        </form>
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
              className="group relative rounded-xl overflow-hidden border border-slate-800/60 bg-slate-900 aspect-[4/3] cursor-zoom-in"
              onClick={() => {
                if (confirmDelete !== item.id) setZoomed(item.url);
              }}
            >
              <img
                src={item.url}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div
                className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200"
                onClick={(e) => {
                  if (confirmDelete === item.id) e.stopPropagation();
                }}
              >
                {confirmDelete === item.id ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 p-3">
                    <p className="text-xs text-slate-300 mb-3 font-medium text-center leading-snug">¿Eliminar esta imagen?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="text-xs px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 active:bg-red-700 transition font-semibold touch-manipulation"
                      >
                        Sí, eliminar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(null);
                        }}
                        className="text-xs px-3 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 active:bg-slate-800 transition touch-manipulation"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(item.id);
                    }}
                    /* Always visible on touch devices; hover-only on pointer devices */
                    className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-red-600 active:bg-red-700 text-white p-2 rounded-lg touch-manipulation"
                    aria-label="Eliminar imagen"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={() => setZoomed(null)}
        >
          <button
            onClick={() => setZoomed(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2.5 transition touch-manipulation"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={zoomed}
            alt=""
            className="max-w-full max-h-[90dvh] rounded-xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

function SubmitBtn({ saving }: { saving: boolean }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="w-full sm:w-auto shrink-0 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-semibold px-4 py-2.5 rounded-xl transition text-sm disabled:opacity-50 flex items-center justify-center gap-1.5 touch-manipulation"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      {saving ? "..." : "Añadir"}
    </button>
  );
}