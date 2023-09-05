const base = "http://localhost:3000";

export function fetchCall(url: string) {
  return fetch(base + url)
    .then((data) => data.json())
    .then((data) => data.data);
}
