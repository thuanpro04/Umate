const { PostModel } = require("../models/postModel");
const { generateUniqueID } = require("../untils/informationUntils");
const { findUserById } = require("./userServices");

const handleActionMyPostEvent = async (req, res) => {
  const data = req.body;
  try {
    const postId = generateUniqueID();
    const newEvent = new PostModel({ ...data, postId });
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
     const data= await Promise.all(posts.map((e) => formatUser(e)));
    console.log(data);
    res.status(200).json({
      message: "Posts fetched successfully",
      data: data,
    });
  } catch (error) {
    console.log("get post error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handleActionMyPostEvent,
  handleActionGetEventForUser,
};
