import { getApiBaseUrl } from './config.js'

const TOKEN_KEY = 'bookyobiz_token'

export function setAuthToken(token) {
  try { localStorage.setItem(TOKEN_KEY, token) } catch {}
}
export function getAuthToken() {
  try { return localStorage.getItem(TOKEN_KEY) || '' } catch { return '' }
}
export function clearAuthToken() {
  try { localStorage.removeItem(TOKEN_KEY) } catch {}
}

function buildHeaders(extra) {
  const headers = { ...(extra || {}) }
  const token = getAuthToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export async function apiGet(path) {
  const base = getApiBaseUrl();
  const url = `${base}${path}`;
  const res = await fetch(url, { headers: buildHeaders(), credentials: 'include' });
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json().catch(() => null);
}

export async function apiPost(path, body) {
  const base = getApiBaseUrl();
  const url = `${base}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: buildHeaders({ 'Content-Type': 'application/json' }),
    credentials: 'include',
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`);
  return res.json().catch(() => null);
}


