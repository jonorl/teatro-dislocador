import DOMPurify from "dompurify";

// Descriptions arrive as HTML written by Gemini (from Instagram captions) or the admin editor. Only formatting
// survives: scripts, event handlers, styles and embeds are removed, and links open safely in a new tab.
const ALLOWED_TAGS = ["p", "div", "br", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li", "a", "span", "h3", "h4", "blockquote"];
const ALLOWED_ATTR = ["href", "target", "rel"];

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
});

export function sanitizeHtml(html: string | undefined): string {
  return DOMPurify.sanitize(html ?? "", { ALLOWED_TAGS, ALLOWED_ATTR });
}
