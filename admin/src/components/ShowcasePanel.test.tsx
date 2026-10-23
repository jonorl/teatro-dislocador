import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShowcasePanel from "./ShowcasePanel";
import notify from "../utils/notify";

jest.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({ getToken: () => Promise.resolve("session-token") }),
}));
// TinyMCE loads its editor from a CDN, so a textarea stands in for it.
jest.mock("@tinymce/tinymce-react", () => ({
  Editor: ({ value, onEditorChange }: { value: string; onEditorChange: (v: string) => void }) => (
    <textarea aria-label="Sinopsis" value={value} onChange={(e) => onEditorChange(e.target.value)} />
  ),
}));
jest.mock("../utils/notify", () => ({ __esModule: true, default: jest.fn() }));

const API = "https://api.test/api";
// Shaped like the API's rows: extra columns, and null for optional fields the CMS never filled in.
const SHOWS = [
  {
    id: "s1",
    title: "Hamlet",
    author: "Shakespeare",
    director: null,
    dates: "Viernes 21hs",
    duration: null,
    description: "<p>Tragedia</p>",
    image: "https://x/hamlet.jpg",
    instagramId: "1789",
    endsAt: "2026-11-01T00:00:00.000Z",
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-02T00:00:00.000Z",
  },
  { id: "s2", title: "Yerma", author: "Lorca", director: "Ramiro", dates: "Sábado 20hs", duration: "80 min", description: "", image: "https://x/yerma.jpg" },
];

const fetchMock = jest.fn<typeof fetch>();
const respond = (body: unknown, status = 200) =>
  Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(body) } as Response);
const requests = (method: string) => fetchMock.mock.calls.filter(([, init]) => (init?.method ?? "GET") === method);

// Field labels aren't tied to their inputs, so inputs are found through the label's wrapper.
const field = (label: string) => within(screen.getByText(label).parentElement!).getByRole("textbox");

beforeEach(() => {
  globalThis.fetch = fetchMock;
  fetchMock.mockImplementation((_input, init) =>
    !init?.method ? respond({ cartelera: SHOWS }) : respond({}, init.method === "DELETE" ? 204 : 200),
  );
});

describe("ShowcasePanel", () => {
  it("lists the shows from the API", async () => {
    render(<ShowcasePanel API={API} />);
    expect(await screen.findByText("Hamlet")).toBeInTheDocument();
    expect(screen.getByText("Yerma")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(`${API}/showcase`);
  });

  it("shows the empty state when nothing is on", async () => {
    fetchMock.mockImplementation(() => respond({ cartelera: [] }));
    render(<ShowcasePanel API={API} />);
    expect(await screen.findByText("No hay obras en cartelera.")).toBeInTheDocument();
  });

  it("publishes a new show", async () => {
    const user = userEvent.setup();
    render(<ShowcasePanel API={API} />);
    await screen.findByText("Hamlet");

    await user.click(screen.getByRole("button", { name: "Nuevo" }));
    await user.type(field("Título *"), "Bodas de sangre");
    await user.type(field("Fechas / Funciones *"), "Domingo 19hs");
    await user.type(screen.getByPlaceholderText("https://..."), "https://x/bodas.jpg");
    await user.type(screen.getByLabelText("Sinopsis"), "Drama rural");
    await user.click(screen.getByRole("button", { name: "Publicar en cartelera" }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith("Obra publicada en cartelera"));
    const [[url, init]] = requests("POST");
    expect(url).toBe(`${API}/showcase`);
    expect(init?.headers).toEqual({ Authorization: "Bearer session-token", "Content-Type": "application/json" });
    expect(JSON.parse(init?.body as string)).toEqual({
      title: "Bodas de sangre",
      author: "",
      director: "",
      dates: "Domingo 19hs",
      duration: "",
      description: "Drama rural",
      image: "https://x/bodas.jpg",
    });
  });

  it("edits a show and sends back only the form's fields", async () => {
    const user = userEvent.setup();
    render(<ShowcasePanel API={API} />);
    await screen.findByText("Hamlet");

    await user.click(screen.getAllByTitle("Editar")[0]);
    // null from the API becomes an empty input rather than an uncontrolled one.
    expect(field("Director")).toHaveValue("");
    await user.type(field("Director"), "Ramiro");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith("Obra actualizada"));
    const [[url, init]] = requests("PUT");
    expect(url).toBe(`${API}/showcase/s1`);
    expect(JSON.parse(init?.body as string)).toEqual({
      title: "Hamlet",
      author: "Shakespeare",
      director: "Ramiro",
      dates: "Viernes 21hs",
      duration: "",
      description: "<p>Tragedia</p>",
      image: "https://x/hamlet.jpg",
    });
  });

  it("shows the server's error when saving fails", async () => {
    fetchMock.mockImplementation((_input, init) =>
      !init?.method ? respond({ cartelera: SHOWS }) : respond({ error: "Argument 'endsAt' is not a valid date." }, 400),
    );
    const user = userEvent.setup();
    render(<ShowcasePanel API={API} />);
    await screen.findByText("Hamlet");

    await user.click(screen.getAllByTitle("Editar")[1]);
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith("Argument 'endsAt' is not a valid date.", "err"));
  });

  it("deletes a show after confirmation", async () => {
    const user = userEvent.setup();
    render(<ShowcasePanel API={API} />);
    await screen.findByText("Hamlet");

    await user.click(screen.getAllByTitle("Eliminar")[1]);
    expect(requests("DELETE")).toHaveLength(0);
    const confirm = screen.getByText("¿Confirmar?").parentElement!;
    await user.click(within(confirm).getByRole("button", { name: "Eliminar" }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith("Obra eliminada"));
    expect(requests("DELETE")[0][0]).toBe(`${API}/showcase/s2`);
  });
});
