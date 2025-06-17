export const apiFetch = async (path: string, init: RequestInit) => {
  return fetch(import.meta.env.VITE_API_HOST + path, init)
}
