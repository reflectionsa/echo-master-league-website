/**
 * useEmlApi - low-level fetch wrapper for the EML Cloudflare Worker API
 */
const WORKER_URL = import.meta.env.VITE_WORKER_URL;

export async function emlApi(method, path, body, discordId) {
  if (!WORKER_URL) throw new Error('VITE_WORKER_URL not configured');
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(discordId ? { 'X-Admin-Discord-Id': discordId } : {}),
    },
  };
  if (body && method !== 'GET') opts.body = JSON.stringify(body);
  const res = await fetch(`${WORKER_URL}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}
