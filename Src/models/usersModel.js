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
  majoring: {
    type: String,
  },
  sex: {
    type: String,
  },
  access: {
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

const groupSchema = new mongoose.Schema({
  groupID: { type: String, required: true, unique: true },
  groupName: { type: String, required: true },
  members: [{ type: String, ref: "User" }],
});

const postSchema = new mongoose.Schema({
  postID: { type: String, required: true, unique: true },
  userID: { type: String, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  likes: [{ type: String, ref: "User" }],
  comments: [
    {
      commentID: { type: String, required: true, unique: true },
      userID: { type: String, ref: "User", required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const messageSchema = new mongoose.Schema({
  messageID: { type: String, required: true, unique: true },
  senderID: { type: String, ref: "User", required: true },
  receiverID: { type: String, ref: "User", required: true },
  content: { type: String},
  imagesUrl: [{ type: String }],
  timestamp: { type: Date, default: Date.now, index: true },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  }, // Trạng thái tin nhắn
});

const conversationSchema = new mongoose.Schema(
  {
    conversationID: { type: String, required: true, unique: true },
    participants: [{ type: String, ref: "User", required: true }],
    messages: [messageSchema],
    lastMessage: { type: String }, // Tin nhắn mới nhất
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);
const GroupModel = mongoose.model("Group", groupSchema);
const PostModel = mongoose.model("Post", postSchema);
const MessageModel = mongoose.model("Message", conversationSchema);

module.exports = {
  UserModel,
  GroupModel,
  PostModel,
  MessageModel,
};
