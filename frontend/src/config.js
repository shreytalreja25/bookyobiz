export function getApiBaseUrl() {
  const useLocal = String(import.meta.env.VITE_USE_LOCAL_API || '').toLowerCase();
  const isLocal = useLocal === 'true' || useLocal === '1' || useLocal === 'yes';
  const localUrl = import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:3000';
  const cloudUrl = import.meta.env.VITE_CLOUD_API_URL || '';
  return isLocal ? localUrl : cloudUrl;
}


