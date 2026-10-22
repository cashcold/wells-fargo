/**
 * Centralized API configuration and URL resolution for Web and Android APK (Capacitor)
 */

export const VERCEL_PROD_API_URL = 'https://wells-fargo-git-main-the-christs-projects.vercel.app';
export const AIS_DEV_API_URL = 'https://ais-dev-mcffugmxnzq4g5fvfrihe5-811321163091.europe-west2.run.app';

export function getApiBaseUrl(): string {
  try {
    const custom = localStorage.getItem('wf_api_base_url');
    if (custom && custom.trim()) {
      return custom.trim().replace(/\/$/, '');
    }
  } catch {
    // Ignore localStorage access issues
  }

  // Vite environment variable if set during build
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }

  // Detect if running inside Capacitor Android/iOS WebView or packaged native APK
  if (typeof window !== 'undefined') {
    const isCapacitor =
      Boolean((window as any).Capacitor?.isNativePlatform?.()) ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'file:' ||
      (window.location.hostname === 'localhost' && window.location.port !== '3000' && window.location.port !== '5173');

    if (isCapacitor) {
      // Connect to the deployed live cloud banking backend on Vercel where MongoDB is synced
      return VERCEL_PROD_API_URL;
    }
  }

  return '';
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${cleanPath}` : cleanPath;
}

export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const primaryUrl = apiUrl(path);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(primaryUrl, {
      ...options,
      signal: options?.signal || controller.signal,
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    // If running in Capacitor and primary URL had network failure, attempt secondary dev URL
    const base = getApiBaseUrl();
    if (base && base === VERCEL_PROD_API_URL) {
      try {
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        const fallbackUrl = `${AIS_DEV_API_URL}${cleanPath}`;
        return await fetch(fallbackUrl, options);
      } catch {
        // Fall through to throw original error
      }
    }
    throw err;
  }
}
