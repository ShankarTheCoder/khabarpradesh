import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { formatDate, formatViews } from "../utils/format";

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState("");

  function loadNews() {
    setLoading(true);
    api
      .getNews()
      .then(setItems)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadNews();
  }, []);

  async function handleDelete(id, title) {
    if (!window.confirm(`के तपाईं साँच्चै "${title}" हटाउन चाहनुहुन्छ?`)) return;
    setDeletingId(id);
    try {
      await api.deleteArticle(id);
      setItems((prev) => prev.filter((n) => n.id !== id));
      setNotice("समाचार सफलतापूर्वक हटाइयो।");
      setTimeout(() => setNotice(""), 3000);
    } catch (e) {
      window.alert(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink pb-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink">प्रशासक ड्यासबोर्ड</h1>
          <p className="text-sm text-slate font-utility mt-1">
            स्वागत छ, {admin?.name} ({admin?.username})
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/news/new"
            className="bg-turmeric hover:bg-turmeric-dark text-ink font-utility font-bold px-4 py-2.5 rounded-sm transition-colors text-sm"
          >
            + नयाँ समाचार थप्नुहोस्
          </Link>
          <button
            onClick={logout}
            className="border border-ink/30 hover:bg-ink hover:text-paper text-ink font-utility font-semibold px-4 py-2.5 rounded-sm transition-colors text-sm"
          >
            लगआउट
          </button>
        </div>
      </div>

      {notice && (
        <p className="bg-green-50 text-green-700 border border-green-200 text-sm px-4 py-2.5 rounded-sm mb-6 font-body">
          {notice}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="कुल समाचार" value={items.length} />
        <StatCard label="ब्रेकिंग" value={items.filter((n) => n.breaking).length} />
        <StatCard label="फिचर्ड" value={items.filter((n) => n.featured).length} />
        <StatCard
          label="कुल भ्युज"
          value={formatViews(items.reduce((s, n) => s + (n.views || 0), 0))}
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto border border-ink/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ink text-paper text-left font-utility uppercase tracking-wide text-xs">
                <th className="px-4 py-3">शीर्षक</th>
                <th className="px-4 py-3">श्रेणी</th>
                <th className="px-4 py-3">मिति</th>
                <th className="px-4 py-3">भ्युज</th>
                <th className="px-4 py-3">स्थिति</th>
                <th className="px-4 py-3 text-right">कार्य</th>
              </tr>
            </thead>
            <tbody>
              {items.map((n) => (
                <tr key={n.id} className="border-t border-ink/10 hover:bg-turmeric/5">
                  <td className="px-4 py-3 font-body font-medium text-charcoal max-w-xs">
                    <span className="line-clamp-2">{n.title}</span>
                  </td>
                  <td className="px-4 py-3 text-slate whitespace-nowrap">{n.category}</td>
                  <td className="px-4 py-3 text-slate whitespace-nowrap font-utility text-xs">
                    {formatDate(n.publishedAt)}
                  </td>
                  <td className="px-4 py-3 text-slate font-utility">{formatViews(n.views)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {n.breaking && (
                        <span className="bg-sindoor/10 text-sindoor text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                          ब्रेकिंग
                        </span>
                      )}
                      {n.featured && (
                        <span className="bg-turmeric/20 text-turmeric-dark text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                          फिचर्ड
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      to={`/admin/news/${n.id}/edit`}
                      className="text-ink hover:text-sindoor font-utility font-semibold text-xs mr-3"
                    >
                      सम्पादन गर्नुहोस्
                    </Link>
                    <button
                      onClick={() => handleDelete(n.id, n.title)}
                      disabled={deletingId === n.id}
                      className="text-sindoor hover:text-sindoor-dark font-utility font-semibold text-xs disabled:opacity-50"
                    >
                      {deletingId === n.id ? "हट्दैछ..." : "हटाउनुहोस्"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <p className="text-center text-slate py-12">कुनै समाचार उपलब्ध छैन।</p>
          )}
        </div>
      )}

      {/* Floating + button for quick news posting */}
      <Link
        to="/admin/news/new"
        title="नयाँ समाचार थप्नुहोस्"
        aria-label="नयाँ समाचार थप्नुहोस्"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-14 h-14 rounded-full bg-sindoor hover:bg-sindoor-dark text-paper shadow-lg shadow-ink/30 flex items-center justify-center text-3xl font-light transition-all hover:scale-105 active:scale-95"
      >
        <span className="-mt-0.5">+</span>
      </Link>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-ink/10 p-4">
      <p className="text-2xl font-display text-ink">{value}</p>
      <p className="text-xs text-slate font-utility uppercase tracking-wide mt-1">{label}</p>
    </div>
  );
}
