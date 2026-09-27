const express = require("express");
const Event = require("../models/Event");
const User = require("../models/User");
const Registration = require("../models/Registration");
const { auth, adminOnly } = require("../middleware/auth");
const router = express.Router();

// GET /api/registrations (Admin only - view all student registrations from MongoDB)
router.get("/", auth, adminOnly, async (req, res, next) => {
  try {
    const list = await Registration.find()
      .populate("user", "name email role")
      .populate("event")
      .sort({ registeredAt: -1 });
    res.json(list.filter((r) => r.event !== null));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/registrations/:id (Admin only - remove registration from MongoDB and restore seat)
router.delete("/:id", auth, adminOnly, async (req, res, next) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) {
      return res.status(404).json({ message: "Registration not found in database" });
    }
    // Restore event seat count
    if (reg.event) {
      await Event.findByIdAndUpdate(reg.event, { $inc: { seats: 1 } });
    }
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: "Registration deleted successfully from database" });
  } catch (err) {
    next(err);
  }
});

// POST /api/registrations
// Handles form submissions and adds them reliably to MongoDB
router.post("/", async (req, res, next) => {
  try {
    let userId = null;
    let userEmail = req.body.email ? req.body.email.trim().toLowerCase() : "";

    // 1. Try to get user from token if header is present
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (e) {
        // Token expired/invalid
      }
    }

    // 2. If no valid token, find user by email or automatically create user in MongoDB
    if (!userId) {
      if (!userEmail) {
        return res.status(400).json({ message: "Email is required to register." });
      }
      let user = await User.findOne({ email: userEmail });
      if (!user) {
        const bcrypt = require("bcrypt");
        const hash = await bcrypt.hash("pass123", 10);
        user = await User.create({
          name: req.body.name || "Student Participant",
          email: userEmail,
          password: hash,
          role: "student",
        });
      }
      userId = user._id;
    }

    // 3. Find event
    let event = null;
    if (req.body.eventId) {
      event = await Event.findById(req.body.eventId);
    }
    if (!event && req.body.eventName) {
      event = await Event.findOne({ name: new RegExp("^" + req.body.eventName.trim() + "$", "i") });
    }
    if (!event && Array.isArray(req.body.selectedEvents) && req.body.selectedEvents.length > 0) {
      for (const evName of req.body.selectedEvents) {
        event = await Event.findOne({ name: new RegExp("^" + evName.trim() + "$", "i") });
        if (event) break;
      }
    }
    if (!event) {
      event = await Event.findOne();
    }
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 4. Check seat availability
    if (event.seats < 1) {
      return res.status(400).json({ message: "No seats left for " + event.name });
    }

    // 5. Check duplicate registration
    const already = await Registration.findOne({
      user: userId,
      event: event._id,
    });
    if (already) {
      return res.status(400).json({ message: "Already registered for " + event.name });
    }

    // 6. Create registration in MongoDB
    const registration = await Registration.create({
      user: userId,
      event: event._id,
      name: req.body.name,
      email: userEmail,
      phone: req.body.phone,
      department: req.body.department,
      dob: req.body.dob,
      gender: req.body.gender,
      message: req.body.message,
    });

    // 7. Decrement seats
    event.seats = event.seats - 1;
    await event.save();

    res.status(201).json({
      message: "Registered successfully for " + event.name,
      registration,
      eventName: event.name,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/registrations/my
router.get("/my", auth, async (req, res, next) => {
  try {
    const userDoc = await User.findById(req.user.id);
    const userEmail = userDoc ? userDoc.email : null;

    const query = userEmail
      ? { $or: [{ user: req.user.id }, { email: userEmail }] }
      : { user: req.user.id };

    const list = await Registration.find(query)
      .populate("event")
      .sort({ registeredAt: -1 });

    res.json(list.filter((r) => r.event !== null));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
