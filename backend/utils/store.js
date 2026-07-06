const fs = require("fs");
const path = require("path");

const NEWS_FILE = path.join(__dirname, "..", "data", "news.json");
const ADMIN_FILE = path.join(__dirname, "..", "data", "admin.json");

function readNews() {
  const raw = fs.readFileSync(NEWS_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeNews(news) {
  fs.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2), "utf-8");
}

function readAdmin() {
  const raw = fs.readFileSync(ADMIN_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeAdmin(admin) {
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(admin, null, 2), "utf-8");
}

module.exports = { readNews, writeNews, readAdmin, writeAdmin };
