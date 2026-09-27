require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Event = require("./models/Event");

const defaultEvents = [
  { name: "Coding Contest", category: "Technical", fee: 100, seats: 50, date: new Date("2026-10-15") },
  { name: "Web Dev Bootcamp", category: "Workshop", fee: 300, seats: 60, date: new Date("2026-09-11") },
  { name: "Robotics Challenge", category: "Technical", fee: 700, seats: 25, date: new Date("2026-10-16") },
  { name: "Cultural Night", category: "Cultural", fee: 0, seats: 200, date: new Date("2026-10-17") },
  { name: "Football Tournament", category: "Sports", fee: 150, seats: 80, date: new Date("2026-10-18") }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/techfest");
    console.log("Connected to MongoDB");

    // Seed Admin
    let admin = await User.findOne({ email: "admin@techfest.com" });
    if (!admin) {
      const hash = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Admin Coordinator",
        email: "admin@techfest.com",
        password: hash,
        role: "admin"
      });
      console.log("Created admin user: admin@techfest.com / admin123");
    } else {
      console.log("Admin user already exists");
    }

    // Seed Events if empty
    const count = await Event.countDocuments();
    if (count === 0) {
      await Event.insertMany(defaultEvents);
      console.log("Inserted 5 default events");
    } else {
      console.log(`Database already has ${count} events`);
    }

    console.log("Database setup & seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seed();
