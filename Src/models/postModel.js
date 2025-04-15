const { default: mongoose } = require("mongoose");
const postSchema = new mongoose.Schema({
  postId: {
    type: String,
    require: true,
    unique: true,
  },
  url: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  content: {
    type: String,
  },
  title: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  avatar: {
    type: String,
  },
  name: {
    type: String,
  },
  feeling: {
    icon: { type: String }, // emoticon-happy, emoticon-sad, etc.
    name: { type: String }, // Vui vẻ, Buồn, etc.
  },
  privacy: {
    type: String,
    enum: ["public", "friends", "private"],
    default: "public",
  },
  reactions: [
    {
      userId: { type: String, ref: "User" },
      type: {
        type: String,
        enum: ["like", "love", "haha", "wow", "sad", "angry"],
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  likeCount: [{ type: String, ref: "User" }],
  hide: [{ type: String, ref: "User" }],
  commentCount: {
    type: Number,
    default: 0,
  },
  // Số lượt chia sẻ
  shareCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ privacy: 1, createdAt: -1 });
const PostModel = mongoose.model("Post", postSchema);
module.exports = {
  PostModel,
  postSchema,
};
