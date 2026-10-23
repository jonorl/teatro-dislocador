import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { loadSiteData } from "@/lib/siteData";
import Showcase from "./Showcase";

jest.mock("@/lib/siteData", () => ({ loadSiteData: jest.fn() }));
const mockedLoad = jest.mocked(loadSiteData);

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("Showcase", () => {
  it("shows a loader until the shows arrive, then lists them", async () => {
    mockedLoad.mockResolvedValue([
      {
        id: "1",
        title: "Hamlet",
        author: "Shakespeare",
        director: "Ramiro",
        dates: "Viernes 21hs",
        duration: "90 min",
        description: "<p>Una <strong>tragedia</strong></p>",
        image: "https://x/hamlet.jpg",
      },
      { id: "2", title: "Yerma", dates: "Sábado 20hs" },
    ]);

    render(<Showcase />);

    expect(screen.getByText("Cargando cartelera...")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Hamlet" })).toBeInTheDocument();
    expect(screen.queryByText("Cargando cartelera...")).not.toBeInTheDocument();
    expect(mockedLoad).toHaveBeenCalledWith("cartelera");

    expect(screen.getByText("de Shakespeare")).toBeInTheDocument();
    expect(screen.getByText("90 min")).toBeInTheDocument();
    expect(screen.getByText("tragedia").tagName).toBe("STRONG");
    expect(screen.getByRole("img", { name: "Hamlet" })).toHaveAttribute("src", "https://x/hamlet.jpg");
  });

  it("leaves out the optional parts a show does not have", async () => {
    mockedLoad.mockResolvedValue([{ id: "2", title: "Yerma", dates: "Sábado 20hs" }]);
    render(<Showcase />);
    await screen.findByRole("heading", { name: "Yerma" });
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByText(/^de /)).not.toBeInTheDocument();
    expect(screen.queryByText(/Dirección/)).not.toBeInTheDocument();
  });

  it("opens WhatsApp to book tickets", async () => {
    mockedLoad.mockResolvedValue([{ id: "2", title: "Yerma", dates: "Sábado 20hs" }]);
    const open = jest.spyOn(window, "open").mockImplementation(() => null);
    render(<Showcase />);
    await userEvent.click(await screen.findByRole("button", { name: "Reservar Entradas" }));
    expect(open).toHaveBeenCalledWith(expect.stringMatching(/^https:\/\/wa\.me\//));
  });

  it("stops loading and shows nothing when the data cannot be loaded", async () => {
    mockedLoad.mockRejectedValue(new Error("offline"));
    render(<Showcase />);
    await waitFor(() => expect(screen.queryByText("Cargando cartelera...")).not.toBeInTheDocument());
    expect(console.error).toHaveBeenCalledWith("Error loading showcase:", expect.any(Error));
    expect(screen.queryByRole("button", { name: "Reservar Entradas" })).not.toBeInTheDocument();
  });
});
