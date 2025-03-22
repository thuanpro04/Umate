const { default: mongoose } = require("mongoose");
const notificationSchema = new mongoose.Schema({
  groupId: { type: String, ref: "GroupConversation" },
  senderId: { type: String },
  receiverId: { type: String, require: true },
  title: { type: String, require: true },
  content: { type: String },
  type: { type: String },
  data: {
    attended: [{ type: String, ref: "User" }],
    notAttended: [{ type: String, ref: "User" }],
  },
  timestamp: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
});

const notificationModel = mongoose.model("notification", notificationSchema);
module.exports = { notificationModel };
