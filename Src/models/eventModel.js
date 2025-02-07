const { default: mongoose } = require("mongoose");
const eventSchema = new mongoose.Schema({
  // eventId: { type: String, required: true },
  title: { type: String },
  content: { type: String },
  image: { type: String },
  href: { type: String },
  timestamp: { type: String },
  likes: [{ type: String, ref: "User" }],
});
const EventModel = mongoose.model("event", eventSchema);
module.exports = { EventModel };
