const { default: mongoose } = require("mongoose");
const commentSchema = new mongoose.Schema({
  commentId: {
    type: String,
    required: true,
    unique: true,
  },

  postId: {
    type: String,
    required: true,
    ref: "Post",
  },
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  replies: [
    {
      commentRepId: { type: String },
      commentId: { type: String },
      userId: { type: String, ref: "User" },
      name: { type: String },
      avatar: { type: String },
      comment: { type: String },
      timestamp: { type: Date, index: true },
      createdAt: {
        type: Date,
      },
    },
  ],
  comment: {
    type: String,
    required: true,
  },
  avatar: { type: String },
  name: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  timestamp: { type: Date, index: true },
});
commentSchema.index({ postId: 1, createdAt: 1 });
commentSchema.index({ parentCommentId: 1 });

const CommentModel = mongoose.model("Comment", commentSchema);
module.exports = { CommentModel };
