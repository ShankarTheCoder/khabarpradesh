// In production, if VITE_API_URL isn't set at build time, fall back to
// "<same origin>/api" so the admin panel still works when the backend is
// deployed behind a reverse proxy on the same domain. In dev, fall back to
// localhost:5000.
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000/api"
    : `${window.location.origin}/api`);

async function request(path, options = {}) {
  const token = localStorage.getItem("kp_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch (networkErr) {
    throw new Error(
      "सर्भरसँग जडान हुन सकेन। कृपया इन्टरनेट जडान जाँच्नुहोस् वा केही बेरपछि पुनः प्रयास गर्नुहोस्।"
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "केही समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।");
  }
  return data;
}

export const api = {
  getNews: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/news${qs ? `?${qs}` : ""}`);
  },
  getArticle: (slug) => request(`/news/${slug}`),
  getCategories: () => request(`/news/categories`),
  incrementView: (id) => request(`/news/${id}/view`, { method: "POST" }),
  createArticle: (payload) =>
    request(`/news`, { method: "POST", body: JSON.stringify(payload) }),
  updateArticle: (id, payload) =>
    request(`/news/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteArticle: (id) => request(`/news/${id}`, { method: "DELETE" }),
  login: (username, password) =>
    request(`/auth/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  me: () => request(`/auth/me`),
};
