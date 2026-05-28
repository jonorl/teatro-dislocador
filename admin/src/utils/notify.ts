export default function notify(msg: string, type: "ok" | "err" = "ok") {
  window.dispatchEvent(
    new CustomEvent("td:toast", { detail: { msg, type } })
  );
}