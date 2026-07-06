import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { admin, login, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!loading && admin) {
    const dest = location.state?.from || "/admin/dashboard";
    return <Navigate to={dest} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-ink">
      <div className="w-full max-w-md bg-paper p-8 sm:p-10 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-ink">
            खबर <span className="text-sindoor">प्रदेश</span>
          </h1>
          <p className="font-utility text-xs tracking-[0.25em] text-slate uppercase mt-2">
            प्रशासक लगइन
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-body font-semibold text-charcoal mb-1.5">
              प्रयोगकर्ता नाम
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full border border-ink/25 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sindoor/50 rounded-sm"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm font-body font-semibold text-charcoal mb-1.5">
              पासवर्ड
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-ink/25 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sindoor/50 rounded-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sindoor text-sm font-body bg-sindoor/10 px-3 py-2 rounded-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-sindoor hover:bg-sindoor-dark text-paper font-utility font-bold tracking-wide uppercase py-3 rounded-sm transition-colors disabled:opacity-60"
          >
            {submitting ? "लगइन हुँदैछ..." : "लगइन गर्नुहोस्"}
          </button>
        </form>

        <p className="text-center text-xs text-slate mt-6 font-utility">
          केवल अधिकृत खबर प्रदेश कर्मचारीहरूका लागि
        </p>
      </div>
    </div>
  );
}
