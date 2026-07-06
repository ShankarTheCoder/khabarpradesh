import { Link } from "react-router-dom";

export default function BreakingTicker({ items }) {
  if (!items || items.length === 0) return null;

  // Duplicate items so the marquee loop is seamless.
  const loopItems = [...items, ...items];

  return (
    <div className="bg-sindoor text-paper flex items-stretch overflow-hidden">
      <div className="flex items-center gap-2 bg-sindoor-dark px-4 py-2 shrink-0 z-10 shadow-[6px_0_10px_-4px_rgba(0,0,0,0.35)]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-paper" />
        </span>
        <span className="font-utility font-bold tracking-widest text-sm uppercase">
          ब्रेकिंग
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden py-2">
        <div className="flex whitespace-nowrap animate-ticker w-max">
          {loopItems.map((item, i) => (
            <Link
              key={`${item.id}-${i}`}
              to={`/article/${item.slug}`}
              className="mx-6 text-sm md:text-[15px] font-body hover:underline decoration-paper/60 underline-offset-4"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
