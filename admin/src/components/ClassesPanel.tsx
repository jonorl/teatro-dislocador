import { useState, useEffect, useCallback } from "react";
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
import Field from "./UI/Field"
import authHeaders from "../utils/authHeaders";
import { inputCls } from "../const/inputCLs";

interface ClassItem {
  id: string;
  title: string;
  description: string;
  schedule: string;
  createdAt: string;
}

interface AdminDashboardProps {
  API: string;
}

const EMPTY_CLASS = { title: "", description: "", schedule: "" };

export default function ClassesPanel({ API }:AdminDashboardProps) {
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