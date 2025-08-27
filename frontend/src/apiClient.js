import { getApiBaseUrl } from './config.js'

export async function apiGet(path) {
  const base = getApiBaseUrl();
  const url = `${base}${path}`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json().catch(() => null);
}

export async function apiPost(path, body) {
  const base = getApiBaseUrl();
  const url = `${base}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`);
  return res.json().catch(() => null);
}


