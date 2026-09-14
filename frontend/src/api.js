const API = import.meta.env.VITE_API_URL || "";

function authHeaders(extra = {}) {
  const token = localStorage.getItem("access");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function parse(res) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { detail: text };
  }
  if (!res.ok) {
    const detail = data?.detail || data?.username?.[0] || data?.password?.[0] || data?.email?.[0] || "Request failed";
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(data));
  }
  return data;
}

export const api = {
  get: (path) => fetch(`${API}${path}`, { headers: authHeaders() }).then(parse),
  post: (path, body) =>
    fetch(`${API}${path}`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    }).then(parse),
  patch: (path, body) =>
    fetch(`${API}${path}`, {
      method: "PATCH",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    }).then(parse),
  del: (path) =>
    fetch(`${API}${path}`, { method: "DELETE", headers: authHeaders() }).then(async (res) => {
      if (res.status === 204) return null;
      return parse(res);
    }),
  upload: (path, formData) =>
    fetch(`${API}${path}`, {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    }).then(parse),
  download: async (path) => {
    const res = await fetch(`${API}${path}`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Download failed");
    return res.blob();
  },
};
