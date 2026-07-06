const express = require("express");
const { nanoid } = require("nanoid");
const { readNews, writeNews } = require("../utils/store");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function slugify(title) {
  return (
    title
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^\u0900-\u097Fa-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80) || nanoid(8)
  );
}

// GET /api/news - list with optional filters: category, search, featured, breaking, limit
router.get("/", (req, res) => {
  const { category, search, featured, breaking, limit } = req.query;
  let news = readNews();

  if (category && category !== "सभी") {
    news = news.filter((n) => n.category === category);
  }
  if (featured === "true") {
    news = news.filter((n) => n.featured);
  }
  if (breaking === "true") {
    news = news.filter((n) => n.breaking);
  }
  if (search) {
    const q = search.toString().toLowerCase();
    news = news.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.excerpt.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }

  news = news.slice().sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  if (limit) {
    news = news.slice(0, parseInt(limit, 10) || news.length);
  }

  res.json(news);
});

// GET /api/news/categories - distinct category list
router.get("/categories", (req, res) => {
  const news = readNews();
  const categories = [...new Set(news.map((n) => n.category))];
  res.json(categories);
});

// GET /api/news/:slug
router.get("/:slug", (req, res) => {
  const news = readNews();
  const article = news.find((n) => n.slug === req.params.slug || n.id === req.params.slug);
  if (!article) {
    return res.status(404).json({ message: "समाचार फेला परेन।" });
  }
  res.json(article);
});

// POST /api/news/:id/view - increment view count
router.post("/:id/view", (req, res) => {
  const news = readNews();
  const idx = news.findIndex((n) => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "समाचार फेला परेन।" });
  news[idx].views = (news[idx].views || 0) + 1;
  writeNews(news);
  res.json({ views: news[idx].views });
});

// ---- Protected admin routes below ----

// POST /api/news - create article
router.post("/", requireAuth, (req, res) => {
  const { title, category, excerpt, content, image, author, featured, breaking } = req.body || {};

  if (!title || !category || !excerpt || !content) {
    return res.status(400).json({ message: "शीर्षक, श्रेणी, सारांश र विवरण आवश्यक छन्।" });
  }

  const news = readNews();
  const newArticle = {
    id: "n" + nanoid(8),
    title,
    slug: slugify(title) + "-" + nanoid(5),
    category,
    excerpt,
    content,
    image: image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&q=80",
    author: author || "खबर प्रदेश डेस्क",
    publishedAt: new Date().toISOString(),
    views: 0,
    featured: !!featured,
    breaking: !!breaking,
  };

  news.unshift(newArticle);
  writeNews(news);
  res.status(201).json(newArticle);
});

// PUT /api/news/:id - update article
router.put("/:id", requireAuth, (req, res) => {
  const news = readNews();
  const idx = news.findIndex((n) => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "समाचार फेला परेन।" });

  const allowed = ["title", "category", "excerpt", "content", "image", "author", "featured", "breaking"];
  const updates = req.body || {};

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      news[idx][key] = updates[key];
    }
  }

  if (updates.title) {
    news[idx].slug = slugify(updates.title) + "-" + news[idx].id.slice(1, 6);
  }

  writeNews(news);
  res.json(news[idx]);
});

// DELETE /api/news/:id
router.delete("/:id", requireAuth, (req, res) => {
  const news = readNews();
  const idx = news.findIndex((n) => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "समाचार फेला परेन।" });

  const [removed] = news.splice(idx, 1);
  writeNews(news);
  res.json({ message: "समाचार सफलतापूर्वक हटाइयो।", removed });
});

module.exports = router;
