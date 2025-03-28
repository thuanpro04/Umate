const { default: mongoose } = require("mongoose");

const messageSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true },
  senderId: { type: String, ref: "User" },
  receiverId: { type: String, ref: "User" }, // Chỉ dùng cho tin nhắn cá nhân
  recipients: [{ type: String, ref: "User" }], // cho tất cả thành viên group
  content: { type: String },
  reply: { type: {} },
  title: { type: String },
  typeCall: { type: String },
  imagesUrl: [{ type: String }],
  timestamp: { type: Date, default: Date.now, index: true },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
  readBy: [{ type: String, ref: "User" }], // Danh sách user đã đọc tin nhắn
  QRCode: {
    qrdata: { type: String },
    attended: [{ type: String, ref: "User" }],
  },
});
messageSchema.index({ senderId: 1, timestamp: -1 });
messageSchema.index({ groupId: 1, timestamp: -1 });
module.exports = { messageSchema };
