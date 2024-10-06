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
  majoring:{
    type:String
  },
  sex:{
    type:String
  },
  access: {
    type: String,
  },
  friends: [{ type: String, ref: "User" }],
  groups: [{ type: String, ref: "Group" }],
  friendRequests:[{type:String, ref:"User"}],
  removeFriends:[{type:String, ref:'User'}],
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
  groupId: { type: String, required: true, unique: true },
  groupName: { type: String, required: true },
  members: [{ type: String, ref: "User" }],
});

const postSchema = new mongoose.Schema({
  postId: { type: String, required: true, unique: true },
  userID: { type: String, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  likes: [{ type: String, ref: "User" }],
  comments: [
    {
      commentId: { type: String, required: true, unique: true },
      userID: { type: String, ref: "User", required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const messageSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true },
  senderId: { type: String, ref: "User", required: true },
  receiverId: { type: String, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("User", userSchema);
const GroupModel = mongoose.model("Group", groupSchema);
const PostModel = mongoose.model("Post", postSchema);
const MessageModel = mongoose.model("Message", messageSchema);

module.exports = {
  UserModel,
  GroupModel,
  PostModel,
  MessageModel,
};
