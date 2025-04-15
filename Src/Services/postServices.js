const { CommentModel } = require("../models/commentModel");
const { PostModel } = require("../models/postModel");
const { generateUniqueID } = require("../untils/informationUntils");
const { findUserById } = require("./userServices");

const handleActionMyPostEvent = async (req, res) => {
  const data = req.body;
  try {
    const postId = generateUniqueID();
    let url = `http://localhost:3004/post-api/${postId}`;
    const newEvent = new PostModel({ ...data, postId, url });
    await newEvent.save();
    res.status(200).json({
      message: "Post successfully !!!",
      data,
    });
  } catch (error) {
    console.log("My post event error: ", error);
  }
};
const getFriendsList = async (userId) => {
  const user = await findUserById(userId);
  return user.friends;
};
const formatUser = async (item) => {
  const user = await findUserById(item.userId);

  return {
    postId: item.postId,
    userId: user.userId,
    name: user.name,
    avatar: user.avatar,
    content: item.content,
    images: item.images,
    likes: item.likeCount,
    comments: item.commentCount,
    shares: item.shareCount,
    createdAt: item.createdAt,
    url: item.url,
    privacy: item.privacy,
    hide: item.hide ?? [],
  };
};
const handleActionGetEventForUser = async (req, res) => {
  const { id, page = 1, limit = 10 } = req.query;
  try {
    const skip = (page - 1) * limit;

    // Lấy danh sách bạn bè của user (giả sử bạn có hàm getFriendsList)
    const friendsList = await getFriendsList(id);

    // Lọc bài đăng theo điều kiện
    const posts = await PostModel.find({
      $and: [
        {
          $or: [
            { privacy: "public" },
            { userId: id },
            { privacy: "friends", userId: { $in: friendsList } },
          ],
        },
        {
          hide: { $nin: [id] },
        },
      ],
    })
      .sort({ createdAt: -1 }) // Sắp xếp bài đăng mới nhất trước
      .skip(skip)
      .limit(parseInt(limit));
    const data = await Promise.all(posts.map((e) => formatUser(e)));
    // console.log(data);
    res.status(200).json({
      message: "Posts fetched successfully",
      data: {
        postData: data,
        totalPage: Math.ceil(data.length / limit),
      },
    });
  } catch (error) {
    console.log("get post error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getPost = async (id) => {
  return await PostModel.findOne({ postId: id });
};
const handleActionLikePostForUser = async (req, res) => {
  const { userId, id } = req.body;
  console.log({ userId, id });
  try {
    const post = await getPost(id);
    if (!post) {
      return res.status(404).json({
        message: "Post not found !!",
      });
    }
    let likeCount = post.likeCount;
    console.log("likeCount: ", post.likeCount);

    const isLike = likeCount.includes(userId);
    likeCount = isLike
      ? likeCount.filter((e) => e !== userId)
      : [...likeCount, userId];
    post.likeCount = likeCount;
    await post.save();
    res.status(200).json({
      message: "Like post successfully !!",
      data: likeCount,
    });
  } catch (error) {
    console.log("Like post error: ", error);
  }
};
const handleActionOpenLink = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await getPost(id);
    if (!post) {
      return res.status(404).json({
        message: "Post not found !!",
      });
    }
    res.send(`
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Bài đăng</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .image { max-width: 100%; height: auto; margin-top: 10px; }
            .feeling { margin-top: 10px; font-style: italic; color: gray; }
          </style>
        </head>
        <body>
          <h1>Bài đăng</h1>
          <p><strong>Nội dung:</strong> ${
            post.content || "Không có nội dung"
          }</p>
    
          ${
            post.images && post.images.length > 0
              ? post.images
                  .map((img) => `<img src="${img}" class="image" />`)
                  .join("")
              : "<p>Không có hình ảnh</p>"
          }
    
          ${
            post.feeling?.name
              ? `<p class="feeling">Cảm xúc: ${post.feeling.name}</p>`
              : ""
          }
          <p><strong>Ngày đăng:</strong> ${new Date(
            post.createdAt
          ).toLocaleString("vi-VN")}</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.log("Open link error: ", error);
  }
};
const handleActionGetMyPost = async (req, res) => {
  const { id, currentId } = req.query;

  try {
    let posts;

    if (id === currentId) {
      // Nếu người dùng đang xem trang cá nhân của mình, lấy tất cả bài viết
      posts = await PostModel.find({ userId: id }).sort({ createdAt: -1 });
    } else {
      // Lấy danh sách bạn bè của người dùng
      const friendsList = await getFriendsList(currentId);

      // Kiểm tra xem currentId có phải là bạn của id không
      const isFriend = friendsList.includes(id);

      // Tạo điều kiện tìm kiếm dựa vào mối quan hệ
      let query = {
        userId: id,
        hide: { $nin: [currentId] }, // Không hiển thị các bài viết mà người dùng đã ẩn
      };

      if (!isFriend) {
        // Nếu không phải bạn bè, chỉ lấy các bài viết công khai
        query.privacy = "public";
      } else {
        // Nếu là bạn bè, lấy các bài viết công khai và bài viết cho bạn bè
        query.$or = [{ privacy: "public" }, { privacy: "friends" }];
      }

      posts = await PostModel.find(query).sort({ createdAt: -1 });
    }

    return res.status(200).json({
      message: "Get posts successfully!",
      data: posts || [],
    });
  } catch (error) {
    console.log("Get my post error: ", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const handleActionRemovePost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await PostModel.deleteOne({ postId: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Post not found !!!",
      });
    }
    res.status(200).json({
      message: "Remove post successfully !!!",
      data: id,
    });
  } catch (error) {
    console.log("Remove post error: ", error);
  }
};
const handleActionRemovePostShare = async (req, res) => {
  const { id, userId } = req.query;
  if (!id || !userId) {
    return res.status(400).json({ message: "Thiếu id hoặc userId" });
  }
  try {
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    user.eventShares = user.eventShares.filter((item) => item.postId !== id);
    await user.save();

    res.status(200).json({
      message: "Remove post share successfully !!!",
      data: id,
    });
  } catch (error) {
    console.log("Remove post share error: ", error);
  }
};
const handleActionHidePost = async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const post = await getPost(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found!!",
      });
    }
    post.hide = [...post.hide, userId];
    await post.save();
    res.status(200).json({
      message: "Hide post successfully !!",
      data: userId,
    });
  } catch (error) {
    console.log("hide post error: ", error);
  }
};
const handleActionHideSharePostInPersonal = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found !!",
      });
    }
    user.eventShares = user.eventShares.map((post) => {
      if (post.postId === postId) {
        const existUser = post.hide.includes(userId);
        return {
          ...post,
          hide: existUser
            ? post.hide.filter((item) => item !== userId)
            : [...post.hide, userId],
        };
      }
      return post;
    });
    console.log("Hide share post successfully !!");

    await user.save();
    res.status(200).json({
      message: "Hide share post successfully !!",
      data: user.eventShares,
    });
  } catch (error) {
    console.log("Hide share post error: ", error);
  }
};
const handleActionUpdatePrivacy = async (req, res) => {
  const { postId, privacy } = req.body;
  try {
    const post = await getPost(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found !!",
      });
    }
    post.privacy = privacy;
    await post.save();
    res.status(200).json({
      message: "Update successfully !!!",
    });
  } catch (error) {
    console.log("Update privacy error: ", error);
  }
};
const handleActionCreateComment = async (req, res) => {
  const data = req.body;
  try {
    const comment = new CommentModel(data);
    await comment.save();
    const updatedCommentCount = await PostModel.findOneAndUpdate(
      { postId: data.postId },
      { $inc: { commentCount: 1 } }
    );
    res.status(200).json({
      message: "Comment created successfully !!",
      data,
    });
  } catch (error) {
    console.log("Create comment error: ", error);
  }
};
const hanldeActionGetComments = async (req, res) => {
  const { id } = req.query;
  try {
    const comment = await CommentModel.findOne({ postId: id }).lean();
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    res.status(200).json({
      message: "Get commented successfully !!!",
      data: comment,
    });
  } catch (error) {
    console.log("Get comment error: ", error);
  }
};
const handleAddReplyComment = async (req, res) => {
  const data = req.body;
  try {
    const updatedComment = await CommentModel.findOneAndUpdate(
      { commentId: data.commentId },
      { $push: { replies: data } },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    res.status(200).json({
      message: "Reply comment successfully",
      data: updatedComment,
    });
  } catch (error) {
    console.log("Reply comment error: ", error);
  }
};
module.exports = {
  handleActionMyPostEvent,
  handleActionGetEventForUser,
  handleActionLikePostForUser,
  formatUser,
  handleActionOpenLink,
  handleActionGetMyPost,
  handleActionRemovePost,
  handleActionRemovePostShare,
  handleActionHidePost,
  handleActionHideSharePostInPersonal,
  handleActionUpdatePrivacy,
  handleActionCreateComment,
  hanldeActionGetComments,
  handleAddReplyComment,
};
