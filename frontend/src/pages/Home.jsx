import { useEffect, useState } from "react";
import { api } from "../api";
import BreakingTicker from "../components/BreakingTicker";
import NewsCard from "../components/NewsCard";
import Loader from "../components/Loader";
import { CATEGORIES } from "../components/Header";
import { Link } from "react-router-dom";

export default function Home() {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getNews()
      .then(setAll)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="ताजा समाचार लोड हुँदैछ..." />;
  if (error)
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-sindoor font-body">
        {error}
      </div>
    );

  const breaking = all.filter((n) => n.breaking);
  const featured = all.filter((n) => n.featured);
  const hero = featured[0] || all[0];
  const heroSide = all.filter((n) => n.id !== hero?.id).slice(0, 4);
  const trending = [...all].sort((a, b) => b.views - a.views).slice(0, 5);
  const latest = all.filter((n) => n.id !== hero?.id).slice(0, 8);

  return (
    <div>
      <BreakingTicker items={breaking.length ? breaking : all.slice(0, 5)} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero section */}
        {hero && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <NewsCard article={hero} size="large" />
            </div>
            <div className="flex flex-col divide-y divide-ink/10">
              {heroSide.map((a) => (
                <NewsCard key={a.id} article={a} size="row" />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
          {/* Latest news grid */}
          <div className="lg:col-span-2">
            <SectionHeading title="ताजा समाचार" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
              {latest.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          </div>

          {/* Trending sidebar */}
          <aside>
            <SectionHeading title="सबैभन्दा बढी पढिएको" />
            <ol className="space-y-4">
              {trending.map((a, i) => (
                <li key={a.id}>
                  <Link to={`/article/${a.slug}`} className="group flex gap-3 items-start">
                    <span className="font-display text-3xl text-turmeric-dark leading-none w-9 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-body font-medium text-charcoal leading-snug group-hover:text-sindoor transition-colors line-clamp-2">
                      {a.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="mt-10 bg-ink text-paper p-6">
              <h3 className="font-display text-xl mb-2">खबर प्रदेशसँग जोडिनुहोस्</h3>
              <p className="text-sm text-paper/70 leading-relaxed">
                प्रदेश र देशको हरेक ठूलो खबर सबैभन्दा पहिले पाउन खबर प्रदेशमा
                जोडिइरहनुहोस्।
              </p>
            </div>
          </aside>
        </div>

        {/* Category strips */}
        {CATEGORIES.map((cat) => {
          const items = all.filter((n) => n.category === cat).slice(0, 3);
          if (items.length === 0) return null;
          return (
            <div key={cat} className="mt-14">
              <SectionHeading title={cat} link={`/category/${encodeURIComponent(cat)}`} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {items.map((a) => (
                  <NewsCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionHeading({ title, link }) {
  return (
    <div className="flex items-baseline justify-between border-b-2 border-ink mb-5 pb-2">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {link && (
        <Link to={link} className="text-sm font-utility text-sindoor hover:underline">
          सबै हेर्नुहोस् →
        </Link>
      )}
    </div>
  );
}
