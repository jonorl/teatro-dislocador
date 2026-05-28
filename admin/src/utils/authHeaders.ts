export default function authHeaders(token: string, multipart = false) {
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (!multipart) headers["Content-Type"] = "application/json";
  return headers;
}