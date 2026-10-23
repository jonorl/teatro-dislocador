// fetch and JSON parsing can reject with non-Error values, so the toast still gets readable text.
export default function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
