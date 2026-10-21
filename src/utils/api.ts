/**
 * Centralized API configuration and URL resolution for Web and Android APK (Capacitor)
 */

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

  // Detect if running inside Capacitor Android/iOS WebView
  if (typeof window !== 'undefined') {
    const isCapacitor =
      Boolean((window as any).Capacitor?.isNativePlatform?.()) ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'file:' ||
      (window.location.hostname === 'localhost' && window.location.port !== '3000' && window.location.port !== '5173');

    if (isCapacitor) {
      // Connect to the deployed live cloud banking backend where MongoDB is synced
      return 'https://ais-dev-cnwj3gykzh7mrklug7lsac-184385438078.europe-west2.run.app';
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
  const url = apiUrl(path);
  return fetch(url, options);
}
