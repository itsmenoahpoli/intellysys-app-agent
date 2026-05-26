export function getEnv(key: string, fallback: string = ""): string {
  return import.meta.env[key] || fallback;
}

export function getApiUrl(): string {
  return (
    import.meta.env.RENDERER_VITE_API_URL ||
    "https://api.wapintellysys.it.com/api/v1"
  );
}
