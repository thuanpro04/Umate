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
  parentCommentId: {
    type: String,
    ref: "Comment",
    default: null,
  },

  content: {
    type: String,
    required: true,
  },
  images: [
    {
      uri: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
commentSchema.index({ postId: 1, createdAt: 1 });
commentSchema.index({ parentCommentId: 1 });

const CommentModel = mongoose.model("Comment", commentSchema);
module.exports = { CommentModel };
