const { default: mongoose } = require("mongoose");
const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  familyName: {
    type: String,
  },
  givenName: {
    type: String,
  },
  avatar: {
    type: String,
  },
  sex: {
    type: String,
  },
  access: {
    type: String,
  },
  className: {
    type: String,
  },
  majoring: {
    type: String,
  },
  majorCategory: {
    type: String,
  },
  friends: [{ type: String, ref: "User" }],
  groups: [{ type: String, ref: "Group" }],
  friendRequests: [{ type: String, ref: "User" }],
  removeFriends: [{ type: String, ref: "User" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const commentSchema = new mongoose.Schema({
  commentID: { type: String, unique: true },
  userID: { type: String, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const eventSchema = new mongoose.Schema({
  postID: { type: String, required: true, unique: true },
  userID: { type: String, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  likes: [{ type: String, ref: "User" }],
  comments: [commentSchema],
});
const messageSchema = new mongoose.Schema({
  messageID: { type: String, required: true, unique: true },
  senderID: { type: String, ref: "User", required: true },
  receiverID: { type: String, ref: "User" }, // Chỉ dùng cho tin nhắn cá nhân
  groupID: { type: String, ref: "GroupConversation" }, // Chỉ dùng cho tin nhắn nhóm
  content: { type: String },
  imagesUrl: [{ type: String }],
  timestamp: { type: Date, default: Date.now, index: true },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
});

messageSchema.index({ senderID: 1, timestamp: -1 });
messageSchema.index({ groupID: 1, timestamp: -1 });
const groupConversationSchema = new mongoose.Schema(
  {
    groupID: { type: String, required: true, unique: true },
    groupName: { type: String, required: true },
    description: { type: String },
    invitedUsers: [{ type: String, ref: "User" }],
    leader: { type: String, required: true, ref: "User" },
    deputyLeader: { type: String, ref: "User" },
    messages: [messageSchema], // Tin nhắn của nhóm
    lastMessage: { type: String },
    lastMessageTimestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    conversationID: { type: String, required: true, unique: true },
    participants: [{ type: String, ref: "User", required: true }],
    messages: [messageSchema],
    lastMessage: { type: String }, // Tin nhắn mới nhất
    lastMessageTimestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);
const GroupConversationModel = mongoose.model(
  "GroupConversation",
  groupConversationSchema
);
const EventModel = mongoose.model("Post", eventSchema);
const ConversationModel = mongoose.model("Conversation", conversationSchema);
ConversationModel.collection.dropIndexes();
ConversationModel.collection.createIndex({
  participants: 1,
  lastMessageTimestamp: -1,
});

module.exports = {
  UserModel,
  GroupConversationModel,
  EventModel,
  ConversationModel,
};
