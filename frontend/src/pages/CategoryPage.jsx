import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import NewsCard from "../components/NewsCard";
import Loader from "../components/Loader";

export default function CategoryPage() {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getNews({ category })
      .then(setItems)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="border-b-2 border-ink mb-8 pb-3 flex items-baseline gap-3">
        <h1 className="font-display text-4xl text-ink">{category}</h1>
        <span className="text-sm text-slate font-utility">{items.length} समाचार</span>
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <p className="text-slate py-16 text-center">यस श्रेणीमा हाल कुनै समाचार उपलब्ध छैन।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {items.map((a) => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
