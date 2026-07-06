const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readAdmin } = require("../utils/store");
const { requireAuth, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: "प्रयोगकर्ता नाम र पासवर्ड दुवै आवश्यक छन्।" });
  }

  const admin = readAdmin();

  if (username !== admin.username) {
    return res.status(401).json({ message: "गलत प्रयोगकर्ता नाम वा पासवर्ड।" });
  }

  const valid = bcrypt.compareSync(password, admin.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "गलत प्रयोगकर्ता नाम वा पासवर्ड।" });
  }

  const token = jwt.sign(
    { username: admin.username, name: admin.name },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    token,
    admin: { username: admin.username, name: admin.name },
  });
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  res.json({ admin: req.admin });
});

module.exports = router;
