import { describe, it, expect } from "@jest/globals";
import { sanitizeHtml } from "./sanitizeHtml";

describe("sanitizeHtml", () => {
  it("keeps the formatting the editor and Gemini produce", () => {
    const html = "<p>Una <strong>tragedia</strong> en <em>tres</em> actos</p><ul><li>Viernes</li></ul>";
    expect(sanitizeHtml(html)).toBe(html);
  });

  it.each([
    ['<img src="x" onerror="alert(1)">', ""],
    ["<script>alert(1)</script><p>ok</p>", "<p>ok</p>"],
    ['<p onclick="alert(1)">texto</p>', "<p>texto</p>"],
    ['<iframe src="https://evil.example"></iframe>', ""],
    ['<p style="position:fixed;inset:0">tapado</p>', "<p>tapado</p>"],
  ])("removes %s", (dirty, clean) => {
    expect(sanitizeHtml(dirty)).toBe(clean);
  });

  it("drops javascript: links", () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">clic</a>')).not.toContain("javascript:");
  });

  it("opens links in a new tab without giving the target page access to the site", () => {
    expect(sanitizeHtml('<a href="https://wa.me/123">WhatsApp</a>')).toBe(
      '<a href="https://wa.me/123" target="_blank" rel="noopener noreferrer">WhatsApp</a>',
    );
  });

  it("returns an empty string for missing descriptions", () => {
    expect(sanitizeHtml(undefined)).toBe("");
  });
});
