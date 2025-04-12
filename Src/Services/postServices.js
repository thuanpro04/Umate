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
    id: item.postId,
    user: {
      userId: user.userId,
      name: user.name,
      avatar: user.avatar,
    },
    content: item.content,
    images: item.images,
    likes: item.likeCount,
    comments: item.commentCount,
    shares: item.shareCount,
    createdAt: item.createdAt,
    url: item.url,
    privacy:item.privacy
  };
};
const handleActionGetEventForUser = async (req, res) => {
  const { id, page = 1, limit = 10 } = req.query;
  try {
    const skip = (page - 1) * limit;

    // Lấy danh sách bạn bè của user (giả sử bạn có hàm getFriendsList)
    const friendsList = await getFriendsList(id);
    console.log(friendsList);

    // Lọc bài đăng theo điều kiện
    const posts = await PostModel.find({
      $or: [
        { privacy: "public" },
        { userId: id },
        { privacy: "friends", userId: { $in: friendsList } },
      ],
    })
      .sort({ createdAt: -1 }) // Sắp xếp bài đăng mới nhất trước
      .skip(skip)
      .limit(parseInt(limit));
    const data = await Promise.all(posts.map((e) => formatUser(e)));
    // console.log(data);
    res.status(200).json({
      message: "Posts fetched successfully",
      data: data,
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
      return res.status(401).json({
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
      return res.status(401).json({
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
module.exports = {
  handleActionMyPostEvent,
  handleActionGetEventForUser,
  handleActionLikePostForUser,
  formatUser,
};
