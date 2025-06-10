export const apiFetch = async (path: string, init: RequestInit) => {
  return fetch('http://localhost:4000/api' + path, init)
}
