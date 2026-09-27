const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const regSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: "User", required: true },
  event: { type: ObjectId, ref: "Event", required: true },
  registeredAt: { type: Date, default: Date.now },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  department: { type: String },
  dob: { type: String },
  gender: { type: String },
  message: { type: String },
});

module.exports = mongoose.model("Registration", regSchema);
