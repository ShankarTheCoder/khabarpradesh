const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "khabarpradesh-dev-secret-change-me";

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "प्रमाणीकरण आवश्यक छ। कृपया लगइन गर्नुहोस्।" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "सत्र समाप्त भयो। कृपया फेरि लगइन गर्नुहोस्।" });
  }
}

module.exports = { requireAuth, JWT_SECRET };
