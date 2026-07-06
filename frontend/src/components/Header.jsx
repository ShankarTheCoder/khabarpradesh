import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CATEGORIES = [
  "राजनीति",
  "प्रदेश",
  "खेलकुद",
  "मनोरञ्जन",
  "अर्थतन्त्र",
  "प्रविधि",
];

const todayStr = new Intl.DateTimeFormat("ne-NP", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());

export default function Header() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setMenuOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      {/* Date / utility strip */}
      <div className="bg-ink-dark text-paper/70 text-xs font-utility tracking-wide">
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <span>{todayStr}</span>
          <span className="hidden sm:inline">डिजिटल संस्करण · खबर प्रदेश नेटवर्क</span>
        </div>
      </div>

      {/* Masthead */}
      <div className="bg-paper border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
          <Link to="/" className="group">
            <h1 className="font-display text-4xl sm:text-5xl text-ink tracking-tight leading-none">
              खबर <span className="text-sindoor">प्रदेश</span>
            </h1>
            <p className="font-utility text-[11px] sm:text-xs tracking-[0.3em] text-slate uppercase mt-1">
              साँचो खबर · सही समयमा
            </p>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="समाचार खोज्नुहोस्..."
              className="w-56 lg:w-72 border border-ink/20 bg-white/70 rounded-l-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-turmeric-dark"
            />
            <button
              type="submit"
              className="bg-ink text-paper px-4 py-2 text-sm font-utility font-semibold rounded-r-sm hover:bg-ink-light transition-colors"
            >
              खोज्नुहोस्
            </button>
          </form>

          <button
            className="md:hidden text-ink p-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="मेनु खोल्नुहोस्"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category nav */}
      <nav className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-4 hidden md:flex items-center gap-1 font-utility text-sm tracking-wide">
          <Link
            to="/"
            className="px-3.5 py-3 hover:bg-white/10 transition-colors font-semibold text-turmeric"
          >
            मुखपृष्ठ
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/category/${encodeURIComponent(cat)}`}
              className="px-3.5 py-3 hover:bg-white/10 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col border-t border-white/10">
            <form onSubmit={handleSearch} className="flex p-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="समाचार खोज्नुहोस्..."
                className="flex-1 border border-white/20 bg-white/10 text-paper placeholder:text-paper/50 rounded-l-sm px-3 py-2 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-turmeric text-ink px-4 py-2 text-sm font-semibold rounded-r-sm"
              >
                खोजें
              </button>
            </form>
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 border-t border-white/10 font-semibold text-turmeric"
            >
              मुखपृष्ठ
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/category/${encodeURIComponent(cat)}`}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 border-t border-white/10"
              >
                {cat}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}

export { CATEGORIES };
