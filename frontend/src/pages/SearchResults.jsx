import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";
import NewsCard from "../components/NewsCard";
import Loader from "../components/Loader";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getNews({ search: q })
      .then(setItems)
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="border-b-2 border-ink mb-8 pb-3">
        <h1 className="font-display text-3xl text-ink">
          "{q}"को लागि खोज परिणाम
        </h1>
        <p className="text-sm text-slate font-utility mt-1">{items.length} परिणाम फेला परे</p>
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <p className="text-slate py-16 text-center">कुनै परिणाम फेला परेन। कृपया फरक शब्दले खोज्नुहोस्।</p>
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
