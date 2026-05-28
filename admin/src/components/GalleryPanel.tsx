import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import authHeaders from "../utils/authHeaders";
import notify from "../utils/notify";
import TrashIcon from "./UI/TrashIcon";
import EmptyState from "./UI/EmptyState";
import PanelHeader from "./UI/PanelHeader";
import { labelCls } from "../const/labelCls";
import { inputCls } from "../const/inputCLs";

interface GalleryItem {
  id: string;
  url: string;
}

interface AdminDashboardProps {
  API: string;
}

export default function GalleryPanel({ API }:AdminDashboardProps) {
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