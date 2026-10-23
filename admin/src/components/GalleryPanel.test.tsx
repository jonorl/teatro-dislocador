import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GalleryPanel from "./GalleryPanel";
import notify from "../utils/notify";

jest.mock("@clerk/clerk-react", () => ({
  useAuth: () => ({ getToken: () => Promise.resolve("session-token") }),
}));
jest.mock("../utils/notify", () => ({ __esModule: true, default: jest.fn() }));

const API = "https://api.test/api";
const fetchMock = jest.fn<typeof fetch>();
const respond = (body: unknown, status = 200) =>
  Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(body) } as Response);
const requests = (method: string) => fetchMock.mock.calls.filter(([, init]) => (init?.method ?? "GET") === method);

const imageWithSrc = (container: HTMLElement, src: string) => container.querySelector(`img[src="${src}"]`);

beforeEach(() => {
  globalThis.fetch = fetchMock;
  // jsdom has no object URLs; the panel only uses them for previews.
  URL.createObjectURL = jest.fn((file: Blob) => `blob:${(file as File).name}`) as typeof URL.createObjectURL;
  URL.revokeObjectURL = jest.fn();
  fetchMock.mockImplementation((_input, init) =>
    !init?.method
      ? respond({ galeria: [{ id: "g1", url: "https://x/a.jpg" }, { id: "g2", URL: "https://x/legacy.jpg" }] })
      : respond({}, init.method === "DELETE" ? 204 : 201),
  );
});

describe("GalleryPanel", () => {
  it("lists images, including rows that still use the old URL key", async () => {
    const { container } = render(<GalleryPanel API={API} />);
    await waitFor(() => expect(imageWithSrc(container, "https://x/a.jpg")).not.toBeNull());
    expect(imageWithSrc(container, "https://x/legacy.jpg")).not.toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(`${API}/gallery`);
  });

  it("shows the empty state for an empty gallery", async () => {
    fetchMock.mockImplementation(() => respond({ galeria: [] }));
    render(<GalleryPanel API={API} />);
    expect(await screen.findByText("La galería está vacía.")).toBeInTheDocument();
  });

  it("adds an image by URL", async () => {
    const user = userEvent.setup();
    render(<GalleryPanel API={API} />);
    await screen.findAllByLabelText("Eliminar imagen");

    await user.type(screen.getByPlaceholderText("https://cdn.ejemplo.com/foto.jpg"), "https://x/new.jpg");
    await user.click(screen.getByRole("button", { name: "Añadir" }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith("Imagen añadida a la galería"));
    const [[url, init]] = requests("POST");
    expect(url).toBe(`${API}/gallery`);
    expect(JSON.parse(init?.body as string)).toEqual({ url: "https://x/new.jpg" });
    expect(screen.getByPlaceholderText("https://cdn.ejemplo.com/foto.jpg")).toHaveValue("");
  });

  it("uploads several files in one request", async () => {
    const user = userEvent.setup();
    const { container } = render(<GalleryPanel API={API} />);
    await screen.findAllByLabelText("Eliminar imagen");

    await user.click(screen.getByRole("button", { name: "Desde PC" }));
    const files = [new File(["a"], "uno.png", { type: "image/png" }), new File(["b"], "dos.png", { type: "image/png" })];
    await user.upload(container.querySelector('input[type="file"]') as HTMLInputElement, files);
    expect(screen.getByText("2 imágenes seleccionadas")).toBeInTheDocument();
    expect(screen.getByAltText("Preview 1")).toHaveAttribute("src", "blob:uno.png");

    // jsdom still reports the required file input as empty after user.upload and blocks a click on submit,
    // so the form is submitted directly; a browser accepts it.
    fireEvent.submit(screen.getByRole("button", { name: "Añadir" }).closest("form")!);

    await waitFor(() => expect(notify).toHaveBeenCalledWith("2 imágenes añadidas a la galería"));
    const [[url, init]] = requests("POST");
    expect(url).toBe(`${API}/gallery/upload/multiple`);
    // No Content-Type, so the browser can add the multipart boundary.
    expect(init?.headers).toEqual({ Authorization: "Bearer session-token" });
    expect((init?.body as FormData).getAll("images").map((f) => (f as File).name)).toEqual(["uno.png", "dos.png"]);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:uno.png");
  });

  it("shows the server's error when adding fails", async () => {
    fetchMock.mockImplementation((_input, init) =>
      !init?.method ? respond({ galeria: [{ id: "g1", url: "https://x/a.jpg" }] }) : respond({ error: "Argument 'url' is missing." }, 400),
    );
    const user = userEvent.setup();
    render(<GalleryPanel API={API} />);
    await screen.findAllByLabelText("Eliminar imagen");

    await user.type(screen.getByPlaceholderText("https://cdn.ejemplo.com/foto.jpg"), "https://x/new.jpg");
    await user.click(screen.getByRole("button", { name: "Añadir" }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith("Argument 'url' is missing.", "err"));
  });

  it("deletes an image after confirmation", async () => {
    const user = userEvent.setup();
    render(<GalleryPanel API={API} />);
    const [, second] = await screen.findAllByLabelText("Eliminar imagen");

    await user.click(second);
    expect(requests("DELETE")).toHaveLength(0);
    await user.click(screen.getByRole("button", { name: "Sí, eliminar" }));

    await waitFor(() => expect(notify).toHaveBeenCalledWith("Imagen eliminada"));
    expect(requests("DELETE")[0][0]).toBe(`${API}/gallery/g2`);
  });

  it("does not open the lightbox while confirming a deletion", async () => {
    const user = userEvent.setup();
    const { container } = render(<GalleryPanel API={API} />);
    const [first] = await screen.findAllByLabelText("Eliminar imagen");

    await user.click(imageWithSrc(container, "https://x/a.jpg")!);
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(screen.queryByRole("button", { name: "Cerrar" })).not.toBeInTheDocument();

    await user.click(first);
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByRole("button", { name: "Cerrar" })).not.toBeInTheDocument();
    expect(requests("DELETE")).toHaveLength(0);
  });
});
