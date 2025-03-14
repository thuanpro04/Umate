const { UserModel } = require("../models/usersModel");

const findUserById = async (userId) => {
  return await UserModel.findOne({ userId }).lean();
};
const getUsersByIds = async (userFriends) => {
  users = await UserModel.find({ userId: { $in: userFriends } }).lean();
  return users;
};
const updateUserById = async (userId, updateAction) => {
  const result = await UserModel.updateOne({ userId }, updateAction);
  return result;
};
const cleanData = (data) => {
  const sanitizedData = {};
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === "string") {
      sanitizedData[key] = data[key].normalize("NFC"); // Chuẩn hóa UTF-8
    } else {
      sanitizedData[key] = data[key];
    }
  });
  return sanitizedData;
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
      block: user.block,
      online: user.online,
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
  const sanitizedData = cleanData({
    name,
    className,
    majorCategory,
    majoring,
    avatar,
    sex,
    address,
    bio,
    link,
  });
  try {
    const updateUsers = await UserModel.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $set: sanitizedData,
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
const handleListUserForHeartEvent = async (req, res) => {
  const listUsers = req.body;
  try {
    const userPromises = listUsers.map((userId) => findUserById(userId));
    const listUserInfo = await Promise.all(userPromises);
    const validUsers = listUserInfo.filter(
      (user) => user !== null && user !== undefined
    );
    const user = transformUserData(validUsers);
    if (validUsers && validUsers.length > 0) {
      res.status(200).json({
        message: "get list user info succefully !!!",
        data: user,
      });
    } else {
      res.status(401).json({
        message: "get list user info fail.",
      });
    }
  } catch (error) {
    console.log("handle get list user info error: ", error);
  }
};
const handleUpdateStatusUser = async (req, res) => {
  const { id, status } = req.query;
  const booleanStatus = status === "true";

  try {
    const result = await UserModel.updateOne(
      { userId: id },
      { $set: { online: booleanStatus } }
    );
    res.status(200).json({
      message: "Update status user successfully !!!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const handleActionBlockUser = async (req, res) => {
  const { userId, userFriendId } = req.body;
  console.log({ userId, userFriendId });

  let result;
  try {
    const userInfo = await findUserById(userId);
    if (userInfo.block && userInfo.block.includes(userFriendId)) {
      result = await UserModel.updateOne(
        { userId },
        { $pull: { block: userFriendId } }
      );
    } else {
      result = await UserModel.updateOne(
        { userId: userId },
        { $push: { block: userFriendId } }
      );
    }
    if (result.modifiedCount === 0) {
      return res.status(400).json({
        message: "update block user conversation fail.",
      });
    }
    const updatedUser = await findUserById(userId);
    console.log("Block for user successfully !!");
    res.status(200).json({
      message: "update block user successfully !!",
      data: updatedUser.block,
    });
  } catch (error) {
    console.log("Block user fail ", error);
  }
};

const updateFcmToken = async (userId, fcmTokens) => {
  const result = await UserModel.updateOne(
    { userId },
    { $set: { fcmTokens: fcmTokens } }
  );
  return result;
};

const handleUpdateFcmTokenForUser = async (req, res) => {
  const { userId, fcmTokens } = req.body;

  try {
    const result = await updateFcmToken(userId, fcmTokens);

    res.status(200).json({
      message: "Update fcmtoken successfully !!",
      data: [],
    });
  } catch (error) {
    console.log("update fcmtoken fail ", error);
  }
};
const handleUpdateThemeForUser = async (req, res) => {
  const { userId, theme } = req.body;
  try {
    const result = await UserModel.updateOne({ userId }, { $set: { theme } });

    console.log("update theme successfully!!", userId, theme);

    res.status(200).json({
      message: "Update theme successfully !!",
      data: theme,
    });
  } catch (error) {
    console.log("update theme error: ", error);
  }
};
const handleUpdateLanguge = async (req, res) => {
  const { id, key } = req.body;
  try {
    const result = await UserModel.updateOne(
      { userId: id },
      { $set: { language: key } }
    );
    
    console.log("update language successfully!!", id, key);

    res.status(200).json({
      message: "Update language successfully !!",
      data: key,
    });
  } catch (error) {
    console.log("update language error: ", error);
  }
};
const handleActionRemoveUser = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await UserModel.deleteOne({ userId: id });
    if (result.modifiedCount === 0) {
      return res.status(400).json({
        message: "update block user conversation fail.",
      });
    }
    res.status(200).json({
      message: "Remove successfully !!",
    });
  } catch (error) {
    console.log("Remove user fail: ", error);
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
  handleListUserForHeartEvent,
  handleUpdateStatusUser,
  handleActionBlockUser,
  handleUpdateFcmTokenForUser,
  updateFcmToken,
  handleUpdateThemeForUser,
  handleActionRemoveUser,
  handleUpdateLanguge,
};
