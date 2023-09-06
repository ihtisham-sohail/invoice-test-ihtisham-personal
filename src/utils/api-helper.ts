const base = "http://localhost:3000";

export function fetchCall(url: string) {
  return fetch(base + url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 204) {
        return { data: [] };
      }
      return { data: null };
    })
    .then((data) => data.data)
    .catch((err) => {
      throw err;
    });
}
