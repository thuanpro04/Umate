const { UserModel } = require("../models/usersModel");

const findUserById = async (userId) => {
  return await UserModel.findOne({ userId }).lean();
};
const getUsersByIds = async (userFriends) => {
  users = await UserModel.find({ userId: { $in: userFriends } }).lean();
  return users;
};
const updateUserById = async (userId, updateAction) => {
  const result = await UserModel.updateOne({ userId: userId }, updateAction);
  return result;
};
const filterUsers = async (filter, existingUser) => {
  const { userId, friends, removeFriends, friendRequests } = existingUser;

  switch (filter) {
    case "requests":
      // Lấy người dùng có yêu cầu kết bạn
      return friendRequests.length > 0
        ? await getUsersByIds(friendRequests)
        : null;

    case "suggestfriend":
      // Lấy gợi ý bạn bè trừ bạn hiện tại, đã là bạn hoặc đã bị remove
      return await UserModel.find({
        userId: { $ne: userId, $nin: [...friends, ...removeFriends] },
      }).lean();

    default:
      // Mặc định trả về danh sách bạn bè
      return friends.length > 0
        ? await UserModel.find({
            userId: { $in: friends, $nin: removeFriends },
          }).lean()
        : null;
  }
};

const transformUserData = (users) => {
  return (
    users?.map((user) => ({
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      userId: user.userId,
      friendRequests: user.friendRequests,
      friends: user.friends,
      majoring: user.majoring,
      sex: user.sex,
      majorCategory: user.majorCategory,
      className: user.className,
    })) || []
  );
};

const updateOneProfileInfo = async (req, res) => {
  const {
    userId,
    name,
    majoring,
    majorCategory,
    avatar,
    sex,
    className,
    address,
    bio,
    link,
  } = req.body;
  console.log(req.body);

  try {
    const updateUsers = await UserModel.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $set: {
          name,
          className,
          majorCategory,
          majoring,
          avatar,
          sex,
          address,
          bio,
          link,
        },
      },
      {
        new: true,
      }
    );
    if (!updateUsers) {
      return res.status(401).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", data: updateUsers });
  } catch (error) {
    console.log("updateOneProfileInfo", error);
  }
};
const handleGetUserInfoById = async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await findUserById(userId);
    res.status(200).json({
      message: "Get user info successfully !!",
      data: user,
    });
  } catch (error) {
    console.log("Fail get user info error", error);
  }
};
module.exports = {
  findUserById,
  getUsersByIds,
  updateUserById,
  filterUsers,
  transformUserData,
  updateOneProfileInfo,
  handleGetUserInfoById,
};
