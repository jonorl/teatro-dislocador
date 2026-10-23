import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClassesPanel from "./ClassesPanel";
import notify from "../utils/notify";

jest.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({ getToken: () => Promise.resolve("session-token") }),
}));
// TinyMCE loads its editor from a CDN, so a textarea stands in for it.
jest.mock("@tinymce/tinymce-react", () => ({
  Editor: ({ value, onEditorChange }: { value: string; onEditorChange: (v: string) => void }) => (
    <textarea aria-label="Descripción" value={value} onChange={(e) => onEditorChange(e.target.value)} />
  ),
}));
jest.mock("../utils/notify", () => ({ __esModule: true, default: jest.fn() }));

const API = "https://api.test/api";
const CLASSES = [
  { id: "c1", title: "Iniciación", description: "Para empezar", schedule: "Lunes 19hs", image: "", createdAt: "" },
  { id: "c2", title: "Avanzado", description: "Para seguir", schedule: "Jueves 20hs", image: "https://x/a.jpg", createdAt: "" },
];

const fetchMock = jest.fn<typeof fetch>();
const respond = (body: unknown, status = 200) =>
  Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(body) } as Response);
const requests = (method: string) => fetchMock.mock.calls.filter(([, init]) => (init?.method ?? "GET") === method);

beforeEach(() => {
  globalThis.fetch = fetchMock;
  fetchMock.mockImplementation((_input, init) =>
    !init?.method ? respond({ classes: CLASSES }) : respond({}, init.method === "DELETE" ? 204 : 200),
  );
});

describe("ClassesPanel", () => {
  it("lists the classes from the API", async () => {
    render(<ClassesPanel API={API} />);
    expect(await screen.findByText("Iniciación")).toBeInTheDocument();
    expect(screen.getByText("Jueves 20hs")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(`${API}/classes`);
  });

  it("shows the empty state when there are no classes", async () => {
    fetchMock.mockImplementation(() => respond({ classes: [] }));
    render(<ClassesPanel API={API} />);
    expect(await screen.findByText(/No hay clases todavía/)).toBeInTheDocument();
  });

  it("creates a class with the session token", async () => {
    const user = userEvent.setup();
    render(<ClassesPanel API={API} />);
    await screen.findByText("Iniciación");

    await user.click(screen.getByRole("button", { name: "Nuevo" }));
    await user.type(screen.getByPlaceholderText("Ej: Iniciación al Teatro"), "Clown");
    await user.type(screen.getByPlaceholderText(/Lunes y Miércoles/), "Sábados 10hs");
    await user.type(screen.getByLabelText("Descripción"), "Nariz roja");
    await user.click(screen.getByRole("button", { name: "Crear clase" }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith("Clase creada"));
    const [[url, init]] = requests("POST");
    expect(url).toBe(`${API}/classes`);
    expect(init?.headers).toEqual({ Authorization: "Bearer session-token", "Content-Type": "application/json" });
    expect(JSON.parse(init?.body as string)).toEqual({
      title: "Clown",
      schedule: "Sábados 10hs",
      description: "Nariz roja",
      image: "",
    });
    // Reloads the list after saving.
    expect(requests("GET")).toHaveLength(2);
  });

  it("edits an existing class with PUT", async () => {
    const user = userEvent.setup();
    render(<ClassesPanel API={API} />);
    await screen.findByText("Iniciación");

    await user.click(screen.getAllByTitle("Editar")[0]);
    const title = screen.getByPlaceholderText("Ej: Iniciación al Teatro");
    expect(title).toHaveValue("Iniciación");
    await user.clear(title);
    await user.type(title, "Iniciación II");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith("Clase actualizada"));
    const [[url, init]] = requests("PUT");
    expect(url).toBe(`${API}/classes/c1`);
    expect(JSON.parse(init?.body as string)).toMatchObject({ title: "Iniciación II", schedule: "Lunes 19hs" });
  });

  it("shows the server's error when saving fails", async () => {
    fetchMock.mockImplementation((_input, init) =>
      !init?.method ? respond({ classes: CLASSES }) : respond({ error: "Failed to create class" }, 500),
    );
    const user = userEvent.setup();
    render(<ClassesPanel API={API} />);
    await screen.findByText("Iniciación");

    await user.click(screen.getByRole("button", { name: "Nuevo" }));
    await user.type(screen.getByPlaceholderText("Ej: Iniciación al Teatro"), "Clown");
    await user.type(screen.getByPlaceholderText(/Lunes y Miércoles/), "Sábados");
    await user.click(screen.getByRole("button", { name: "Crear clase" }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith("Failed to create class", "err"));
    expect(requests("GET")).toHaveLength(1);
  });

  it("asks for confirmation before deleting", async () => {
    const user = userEvent.setup();
    render(<ClassesPanel API={API} />);
    await screen.findByText("Iniciación");

    await user.click(screen.getAllByTitle("Eliminar")[1]);
    expect(requests("DELETE")).toHaveLength(0);

    const confirm = screen.getByText("¿Confirmar?").parentElement!;
    await user.click(within(confirm).getByRole("button", { name: "Eliminar" }));
    await waitFor(() => expect(notify).toHaveBeenCalledWith("Clase eliminada"));
    const [[url, init]] = requests("DELETE");
    expect(url).toBe(`${API}/classes/c2`);
    expect(init?.headers).toMatchObject({ Authorization: "Bearer session-token" });
  });

  it("does nothing when the deletion is cancelled", async () => {
    const user = userEvent.setup();
    render(<ClassesPanel API={API} />);
    await screen.findByText("Iniciación");

    await user.click(screen.getAllByTitle("Eliminar")[0]);
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(requests("DELETE")).toHaveLength(0);
    expect(screen.getAllByTitle("Eliminar")).toHaveLength(2);
  });
});
