import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import Loader from "../components/Loader";
import NewsCard from "../components/NewsCard";
import { formatDate, formatViews } from "../utils/format";

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const viewedRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .getArticle(slug)
      .then((data) => {
        setArticle(data);
        if (viewedRef.current !== data.id) {
          viewedRef.current = data.id;
          api.incrementView(data.id).catch(() => {});
        }
        return api.getNews({ category: data.category, limit: 4 });
      })
      .then((rel) => {
        if (rel) setRelated(rel.filter((r) => r.slug !== slug).slice(0, 3));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader label="समाचार लोड हुँदैछ..." />;

  if (error || !article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-sindoor font-body mb-4">{error || "यो समाचार उपलब्ध छैन।"}</p>
        <Link to="/" className="text-ink underline font-utility">मुख पृष्ठमा फर्कनुहोस्</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <Link
        to={`/category/${encodeURIComponent(article.category)}`}
        className="inline-block bg-sindoor text-paper text-xs font-utility font-bold tracking-wider uppercase px-3 py-1 mb-4"
      >
        {article.category}
      </Link>

      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
        {article.title}
      </h1>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate font-utility mt-4 pb-4 border-b border-ink/10">
        <span>लेखक: {article.author}</span>
        <span>·</span>
        <span>{formatDate(article.publishedAt)}</span>
        <span>·</span>
        <span>{formatViews(article.views)} पटक पढिएको</span>
      </div>

      <div className="mt-6 -mx-4 sm:mx-0">
        <img
          src={article.image}
          alt={article.title}
          className="w-full aspect-[16/9] object-cover"
        />
      </div>

      <p className="text-lg sm:text-xl font-body font-medium text-charcoal mt-6 leading-relaxed">
        {article.excerpt}
      </p>

      <div className="mt-6 font-body text-[17px] leading-[1.9] text-charcoal space-y-5">
        {article.content.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-16 pt-8 border-t-2 border-ink">
          <h2 className="font-display text-2xl text-ink mb-6">सम्बन्धित समाचारहरू</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
