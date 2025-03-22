const { default: mongoose, Document } = require("mongoose");
const userSchema = new mongoose.Schema({
  userId: {
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
  address: {
    type: String,
  },
  link: {
    type: String,
  },
  bio: {
    type: String,
  },
  eventShares: [
    {
      eventId: { type: String, ref: "event" },
      content: { type: String },
      urlImage: { type: String },
      href: { type: String },
    },
  ],
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
  online: { type: Boolean },
  block: [{ type: String, ref: "User" }],
  fcmTokens: { type: [String] },
  theme: { type: String, default: "light" },
  language: { type: String, default: "vi" },
  like: { type: Number },
});

const commentSchema = new mongoose.Schema({
  commentID: { type: String, unique: true },
  userID: { type: String, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const messageSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true },
  senderId: { type: String, ref: "User" },
  receiverId: { type: String, ref: "User" }, // Chỉ dùng cho tin nhắn cá nhân
  recipients: [{ type: String, ref: "User" }], // cho tất cả thành viên group
  content: { type: String },
  reply: { type: {} },
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

messageSchema.index({ senderID: 1, timestamp: -1 });
messageSchema.index({ groupID: 1, timestamp: -1 });
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
    theme: { type: String},
    pinnedBy: [{ type: String , ref:'User'}],

  },
  { timestamps: true }
);


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
    pinnedBy: [{ type: String , ref:'User'}],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);
const MessageModel = mongoose.model("message", messageSchema);
const GroupConversationModel = mongoose.model(
  "GroupConversation",
  groupConversationSchema
);

const ConversationModel = mongoose.model("Conversation", conversationSchema);
ConversationModel.collection.dropIndexes();
ConversationModel.collection.createIndex({
  participants: 1,
  lastMessageTimestamp: -1,
});

module.exports = {
  UserModel,
  GroupConversationModel,
  ConversationModel,
  MessageModel,
};
