import { jest, describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { loadSiteData } from "@/lib/siteData";
import Classes from "./Classes";

jest.mock("@/lib/siteData", () => ({ loadSiteData: jest.fn() }));
const mockedLoad = jest.mocked(loadSiteData);

describe("Classes", () => {
  it("lists each class with its schedule", async () => {
    mockedLoad.mockResolvedValue([
      { id: "1", title: "Iniciación", description: "<p>Para empezar</p>", schedule: "Lunes 19hs", image: "https://x/c.jpg" },
      { id: "2", title: "Avanzado", description: "<p>Para seguir</p>", schedule: "Jueves 20hs" },
    ]);

    render(<Classes />);

    expect(await screen.findByRole("heading", { name: "Iniciación" })).toBeInTheDocument();
    expect(mockedLoad).toHaveBeenCalledWith("classes");
    expect(screen.getByText("Lunes 19hs")).toBeInTheDocument();
    expect(screen.getByText("Para seguir")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Registrate" })).toHaveLength(2);
  });
});
