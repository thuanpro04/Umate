const { UserModel } = require("../models/usersModel");

const findUserById = async (userID) => {
  return await UserModel.findOne({ userID: userID }).lean();
};
const getUsersByIds = async (userFriends) => {
  users = await UserModel.find({ userID: { $in: userFriends } }).lean();
  return users;
};
const updateUserById = async (userID, updateAction) => {
  const result = await UserModel.updateOne({ userID: userID }, updateAction);
  return result;
};
const filterUsers = async (filter, existingUser) => {
  const { userID, friends, removeFriends, friendRequests } = existingUser;

  switch (filter) {
    case "requests":
      // Lấy người dùng có yêu cầu kết bạn
      return friendRequests.length > 0
        ? await getUsersByIds(friendRequests)
        : null;

    case "suggestfriend":
      // Lấy gợi ý bạn bè trừ bạn hiện tại, đã là bạn hoặc đã bị remove
      return await UserModel.find({
        userID: { $ne: userID, $nin: [...friends, ...removeFriends] },
      }).lean();

    default:
      // Mặc định trả về danh sách bạn bè
      return friends.length > 0
        ? await UserModel.find({
            userID: { $in: friends, $nin: removeFriends },
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
      userID: user.userID,
      friendRequests: user.friendRequests,
      friends: user.friends,
    })) || []
  );
};

const updateOneProfileInfo = async (req, res) => {
  const { userID, name, majoring, majorCategory, avatar, sex, className } =
    req.body;
  try {
    const updateUsers = await UserModel.findOneAndUpdate(
      {
        userID: userID,
      },
      {
        $set: { name, className, majorCategory, majoring, avatar, sex },
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

module.exports = {
  findUserById,
  getUsersByIds,
  updateUserById,
  filterUsers,
  transformUserData,
  updateOneProfileInfo,
};
