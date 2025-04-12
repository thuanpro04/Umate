const { default: mongoose, Document } = require("mongoose");
const { PostModel, postSchema } = require("./postModel");
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
  eventShares: [postSchema],
  friends: [{ type: String, ref: "User" }],
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
  block: [{ type: String, ref: "User" }],
  theme: { type: String, default: "light" },
  language: { type: String, default: "vi" },
  like: { type: Number },
  myLove: [{ type: String, ref: "User" }],
});
const UserModel = mongoose.model("User", userSchema);
module.exports = {
  UserModel,
};
