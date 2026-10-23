import { jest, describe, it, expect, afterEach } from "@jest/globals";
import { act, render, screen } from "@testing-library/react";
import notify from "../utils/notify";
import ToastRegion from "./ToastItem";

afterEach(() => {
  jest.useRealTimers();
});

describe("ToastRegion", () => {
  it("shows a toast for each notify() and hides it after 3.5 seconds", () => {
    jest.useFakeTimers();
    render(<ToastRegion />);

    act(() => notify("Clase creada"));
    expect(screen.getByText("Clase creada")).toBeInTheDocument();
    expect(screen.getByText("✓")).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(3499));
    expect(screen.getByText("Clase creada")).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(1));
    expect(screen.queryByText("Clase creada")).not.toBeInTheDocument();
  });

  it("marks errors", () => {
    render(<ToastRegion />);
    act(() => notify("Error del servidor", "err"));
    expect(screen.getByText("✕")).toBeInTheDocument();
  });
});
