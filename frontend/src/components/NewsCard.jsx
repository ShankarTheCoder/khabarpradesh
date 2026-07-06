import { Link } from "react-router-dom";
import { formatDate } from "../utils/format";

export default function NewsCard({ article, size = "default" }) {
  if (size === "large") {
    return (
      <Link to={`/article/${article.slug}`} className="group block">
        <div className="relative overflow-hidden bg-ink aspect-[16/10]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-dark/90 via-ink-dark/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
            <span className="inline-block bg-turmeric text-ink text-xs font-utility font-bold tracking-wider uppercase px-2.5 py-1 mb-3">
              {article.category}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-paper leading-snug group-hover:text-turmeric-light transition-colors">
              {article.title}
            </h2>
            <p className="text-paper/70 text-xs font-utility mt-3 tracking-wide">
              {formatDate(article.publishedAt)} · {article.author}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  if (size === "row") {
    return (
      <Link to={`/article/${article.slug}`} className="group flex gap-4 items-start py-3">
        <div className="w-24 h-20 sm:w-28 sm:h-24 shrink-0 overflow-hidden bg-ink/10">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-utility font-bold text-sindoor uppercase tracking-wider">
            {article.category}
          </span>
          <h3 className="font-body font-semibold text-charcoal leading-snug mt-1 line-clamp-2 group-hover:text-sindoor transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-slate mt-1 font-utility">{formatDate(article.publishedAt)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.slug}`} className="group block">
      <div className="overflow-hidden aspect-[4/3] bg-ink/10">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="pt-3">
        <span className="text-[11px] font-utility font-bold text-sindoor uppercase tracking-wider">
          {article.category}
        </span>
        <h3 className="font-body font-semibold text-lg text-charcoal leading-snug mt-1 line-clamp-2 group-hover:text-sindoor transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-slate mt-1.5 line-clamp-2">{article.excerpt}</p>
        <p className="text-xs text-slate/80 mt-2 font-utility">{formatDate(article.publishedAt)}</p>
      </div>
    </Link>
  );
}
