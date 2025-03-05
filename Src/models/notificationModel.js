const { default: mongoose } = require("mongoose");
const notificationSchema = new mongoose.Schema({
  groupId: { type: String, ref: "GroupConversation" },
  senderId: { type: String, require: true },
  receiverId: { type: String, require: true },
  title: { type: String, require: true },
  content: { type: String },
  type: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const notificationModel = mongoose.model("notification", notificationSchema);
module.exports = { notificationModel };

