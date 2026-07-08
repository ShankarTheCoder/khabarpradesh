const express = require("express");
const { nanoid } = require("nanoid");
const News = require("../models/News");
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
router.get("/", async (req, res) => {
  try {
    const { category, search, featured, breaking, limit } = req.query;
    const query = {};

    if (category && category !== "सभी") {
      query.category = category;
    }
    if (featured === "true") {
      query.featured = true;
    }
    if (breaking === "true") {
      query.breaking = true;
    }
    if (search) {
      const q = search.toString().trim();
      const searchRegex = new RegExp(q, "i");
      query.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex }
      ];
    }

    let articlesQuery = News.find(query).sort({ publishedAt: -1 });

    if (limit) {
      articlesQuery = articlesQuery.limit(parseInt(limit, 10));
    }

    const news = await articlesQuery;
    res.json(news);
  } catch (error) {
    console.error("समाचार सूचीकरणमा त्रुटि (Error listing news):", error);
    res.status(500).json({ message: "सर्भरमा समस्या आयो।" });
  }
});

// GET /api/news/categories - distinct category list
router.get("/categories", async (req, res) => {
  try {
    const categories = await News.distinct("category");
    res.json(categories);
  } catch (error) {
    console.error("श्रेणीहरू सूचीकरणमा त्रुटि (Error listing categories):", error);
    res.status(500).json({ message: "सर्भरमा समस्या आयो।" });
  }
});

// GET /api/news/:slug
router.get("/:slug", async (req, res) => {
  try {
    const article = await News.findOne({
      $or: [{ slug: req.params.slug }, { id: req.params.slug }]
    });
    if (!article) {
      return res.status(404).json({ message: "समाचार फेला परेन।" });
    }
    res.json(article);
  } catch (error) {
    console.error("समाचार फेला पार्न त्रुटि (Error finding article):", error);
    res.status(500).json({ message: "सर्भरमा समस्या आयो।" });
  }
});

// POST /api/news/:id/view - increment view count
router.post("/:id/view", async (req, res) => {
  try {
    const article = await News.findOneAndUpdate(
      { id: req.params.id },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!article) return res.status(404).json({ message: "समाचार फेला परेन।" });
    res.json({ views: article.views });
  } catch (error) {
    console.error("भ्यू बढाउनमा त्रुटि (Error incrementing views):", error);
    res.status(500).json({ message: "सर्भरमा समस्या आयो।" });
  }
});

// ---- Protected admin routes below ----

// POST /api/news - create article
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, category, excerpt, content, image, author, featured, breaking } = req.body || {};

    if (!title || !category || !excerpt || !content) {
      return res.status(400).json({ message: "शीर्षक, श्रेणी, सारांश र विवरण आवश्यक छन्।" });
    }

    const newArticle = new News({
      id: "n" + nanoid(8),
      title,
      slug: slugify(title) + "-" + nanoid(5),
      category,
      excerpt,
      content,
      image: image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&q=80",
      author: author || "खबर प्रदेश डेस्क",
      publishedAt: new Date(),
      views: 0,
      featured: !!featured,
      breaking: !!breaking,
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("समाचार सिर्जनामा त्रुटि (Error creating news):", error);
    res.status(500).json({ message: "सर्भरमा समस्या आयो।" });
  }
});

// PUT /api/news/:id - update article
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const allowed = ["title", "category", "excerpt", "content", "image", "author", "featured", "breaking"];
    const updates = req.body || {};

    const article = await News.findOne({ id: req.params.id });
    if (!article) return res.status(404).json({ message: "समाचार फेला परेन।" });

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        article[key] = updates[key];
      }
    }

    if (updates.title) {
      article.slug = slugify(updates.title) + "-" + article.id.slice(1, 6);
    }

    await article.save();
    res.json(article);
  } catch (error) {
    console.error("समाचार सम्पादनमा त्रुटि (Error updating news):", error);
    res.status(500).json({ message: "सर्भरमा समस्या आयो।" });
  }
});

// DELETE /api/news/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const article = await News.findOneAndDelete({ id: req.params.id });
    if (!article) return res.status(404).json({ message: "समाचार फेला परेन।" });
    res.json({ message: "समाचार सफलतापूर्वक हटाइयो।", removed: article });
  } catch (error) {
    console.error("समाचार हटाउनमा त्रुटि (Error deleting news):", error);
    res.status(500).json({ message: "सर्भरमा समस्या आयो।" });
  }
});

module.exports = router;

