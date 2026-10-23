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

  it("keeps toasts fired in the same millisecond apart", () => {
    jest.useFakeTimers();
    // A shared id only shows up as React's duplicate-key warning, so that warning fails the test.
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<ToastRegion />);

    act(() => {
      notify("Primera");
      notify("Segunda");
    });
    expect(screen.getByText("Primera")).toBeInTheDocument();
    expect(screen.getByText("Segunda")).toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(3500));
    expect(screen.queryByText("Primera")).not.toBeInTheDocument();
    expect(screen.queryByText("Segunda")).not.toBeInTheDocument();
  });

  it("marks errors", () => {
    render(<ToastRegion />);
    act(() => notify("Error del servidor", "err"));
    expect(screen.getByText("✕")).toBeInTheDocument();
  });
});
