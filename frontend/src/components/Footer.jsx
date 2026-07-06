import { Link } from "react-router-dom";
import { CATEGORIES } from "./Header";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/80 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <h2 className="font-display text-3xl text-paper">
            खबर <span className="text-turmeric">प्रदेश</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-paper/60 max-w-xs">
            प्रदेशको हरेक खबर, हरेक क्षण — सही, निष्पक्ष र सबैभन्दा छिटो। खबर प्रदेश
            तपाईंको भरपर्दो समाचार साथी हो।
          </p>
        </div>

        <div>
          <h3 className="font-utility uppercase tracking-widest text-xs text-turmeric mb-4">
            श्रेणीहरू
          </h3>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link to={`/category/${encodeURIComponent(cat)}`} className="hover:text-turmeric transition-colors">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-utility uppercase tracking-widest text-xs text-turmeric mb-4">
            खबर प्रदेश
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/admin/login" className="hover:text-turmeric transition-colors">
                प्रशासक लगइन
              </Link>
            </li>
            <li className="text-paper/50">सम्पर्क: desk@khabarpradesh.example</li>
            <li className="text-paper/50">काठमाडौं, नेपाल</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-paper/40 font-utility tracking-wide">
        © {new Date().getFullYear()} खबर प्रदेश — सर्वाधिकार सुरक्षित
      </div>
    </footer>
  );
}
