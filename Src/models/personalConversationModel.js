const { default: mongoose, model } = require("mongoose");
const { messageSchema } = require("./messageModel");

const conversationSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true, unique: true },
    participants: [{ type: String, ref: "User", required: true }],
    message: [messageSchema],
    block: { type: Boolean, default: false },
    lastMessage: { type: String, default: "" }, // Tin nhắn mới nhất
    lastMessageTimestamp: { type: Date, default: Date.now },
    notification: [{ type: String, ref: "User" }],
    nicknames: { type: Map, of: String, default: {} },
    theme: { type: String, default: "light" },
    pinnedBy: [{ type: String, ref: "User" }],
  },
  {
    timestamps: true,
  }
);
const ConversationModel =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);
ConversationModel.collection.dropIndexes();
ConversationModel.collection.createIndex({
  participants: 1,
  lastMessageTimestamp: -1,
});

module.exports = {
  ConversationModel,
};
