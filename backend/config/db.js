const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Admin = require("../models/Admin");
const News = require("../models/News");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/khabarpradesh";

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB जडान भयो (MongoDB connected successfully).");
    
    // Seed initial data if database is empty
    await seedInitialData();
  } catch (error) {
    console.error("MongoDB जडान विफलता (MongoDB connection failure):", error);
    process.exit(1);
  }
}

async function seedInitialData() {
  try {
    // 1. Seed Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log("प्रशासक डेटाबेस खाली छ। सिडिङ सुरु हुँदैछ...");
      const adminPath = path.join(__dirname, "..", "data", "admin.json");
      if (fs.existsSync(adminPath)) {
        const adminData = JSON.parse(fs.readFileSync(adminPath, "utf-8"));
        if (Array.isArray(adminData)) {
          await Admin.insertMany(adminData);
        } else {
          await Admin.create(adminData);
        }
        console.log("प्रशासक डेटाबेस सफलतापूर्वक सिड गरियो।");
      } else {
        console.log("प्रशासक सिड फाइल फेला परेन।");
      }
    }

    // 2. Seed News
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      console.log("समाचार डेटाबेस खाली छ। सिडिङ सुरु हुँदैछ...");
      const newsPath = path.join(__dirname, "..", "data", "news.json");
      if (fs.existsSync(newsPath)) {
        const newsData = JSON.parse(fs.readFileSync(newsPath, "utf-8"));
        if (Array.isArray(newsData) && newsData.length > 0) {
          await News.insertMany(newsData);
          console.log(`${newsData.length} वटा समाचारहरू सफलतापूर्वक सिड गरियो।`);
        } else {
          console.log("समाचार सिड फाइल खाली छ वा अवैध ढाँचामा छ।");
        }
      } else {
        console.log("समाचार सिड फाइल फेला परेन।");
      }
    }
  } catch (error) {
    console.error("डेटा सिडिङमा त्रुटि (Error seeding initial data):", error);
  }
}

module.exports = { connectDB };
