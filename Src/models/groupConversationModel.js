const { default: mongoose } = require("mongoose");
const { messageSchema } = require("./messageModel");

const groupConversationSchema = new mongoose.Schema(
  {
    groupId: { type: String, required: true, unique: true },
    authorId: { type: String, required: true },
    groupName: { type: String, required: true },
    message: [messageSchema],
    description: { type: String },
    invitedUsers: [{ type: String, ref: "User" }],
    leader: {
      userId: { type: String, required: true, ref: "User" },
    },
    deputyLeader: {
      userId: { type: String, ref: "User" },
    },
    avatar: { type: String },
    lastMessage: { type: String },
    lastMessageTimestamp: { type: Date, default: Date.now },
    type: { type: String },
    notification: [{ type: String, ref: "User" }],
    nicknames: { type: Map, of: String, default: {} },
    theme: { type: String },
    pinnedBy: [{ type: String, ref: "User" }],
  },
  { timestamps: true }
);
const GroupConversationModel =
  mongoose.models.GroupConversation ||
  mongoose.model("GroupConversation", groupConversationSchema);
module.exports = { GroupConversationModel };