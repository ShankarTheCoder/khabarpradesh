import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api";
import Loader from "../components/Loader";
import { CATEGORIES } from "../components/Header";

const EMPTY = {
  title: "",
  category: CATEGORIES[0],
  excerpt: "",
  content: "",
  image: "",
  author: "",
  featured: false,
  breaking: false,
};

export default function AdminEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api
      .getArticle(id)
      .then((data) =>
        setForm({
          title: data.title,
          category: data.category,
          excerpt: data.excerpt,
          content: data.content,
          image: data.image,
          author: data.author,
          featured: data.featured,
          breaking: data.breaking,
        })
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (isEdit) {
        await api.updateArticle(id, form);
      } else {
        await api.createArticle(form);
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between border-b-2 border-ink pb-4 mb-8">
        <h1 className="font-display text-3xl text-ink">
          {isEdit ? "खबर सम्पादन गर्नुहोस्" : "नयाँ समाचार थप्नुहोस्"}
        </h1>
        <Link to="/admin/dashboard" className="text-sm font-utility text-slate hover:text-ink">
          ← ड्यासबोर्डमा फर्कनुहोस्
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field label="शीर्षक">
          <input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="input"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="श्रेणी">
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="input"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="लेखक">
            <input
              value={form.author}
              onChange={(e) => update("author", e.target.value)}
              placeholder="खबर प्रदेश डेस्क"
              className="input"
            />
          </Field>
        </div>

        <Field label="तस्बिर URL">
          <input
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
            placeholder="https://..."
            className="input"
          />
        </Field>

        <Field label="सारांश (Excerpt)">
          <textarea
            required
            rows={2}
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            className="input resize-none"
          />
        </Field>

        <Field label="पूर्ण विवरण">
          <textarea
            required
            rows={10}
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            className="input resize-y font-body leading-relaxed"
          />
        </Field>

        <div className="flex gap-8">
          <label className="flex items-center gap-2 text-sm font-body">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="w-4 h-4 accent-sindoor"
            />
            फिचर्ड खबर
          </label>
          <label className="flex items-center gap-2 text-sm font-body">
            <input
              type="checkbox"
              checked={form.breaking}
              onChange={(e) => update("breaking", e.target.checked)}
              className="w-4 h-4 accent-sindoor"
            />
            ब्रेकिंग न्युज
          </label>
        </div>

        {error && (
          <p className="text-sindoor text-sm font-body bg-sindoor/10 px-3 py-2 rounded-sm">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-sindoor hover:bg-sindoor-dark text-paper font-utility font-bold px-6 py-3 rounded-sm transition-colors disabled:opacity-60"
          >
            {saving ? "सेभ हुँदैछ..." : isEdit ? "परिवर्तन सेभ गर्नुहोस्" : "प्रकाशित गर्नुहोस्"}
          </button>
          <Link
            to="/admin/dashboard"
            className="border border-ink/25 text-ink font-utility font-semibold px-6 py-3 rounded-sm hover:bg-ink/5 transition-colors"
          >
            रद्द गर्नुहोस्
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-body font-semibold text-charcoal mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
