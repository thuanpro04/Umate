const { UserModel } = require("../models/usersModel");

const getUser = async (userID) => {
  return await UserModel.findOne({ userID: userID }).lean();
};
const handleUsersRequest = async (userFriends) => {
  users = await UserModel.find({ userID: { $in: userFriends } }).lean();
  return users;
};
const handleUpdate = async (userID, updateAction) => {
  const result = await UserModel.updateOne({ userID: userID }, updateAction);
  return result;
};
const handleUserAction = async (req, res, action) => {
  const { friendUserID, currentUserID } = req.body;
  try {
    // Tìm thông tin người dùng
    // Thực hiện hành động thêm hoặc hủy kết bạn
    const updateAction =
      action === "add"
        ? { $addToSet: { friendRequests: currentUserID } } //thêm ko trùng lập
        : { $pull: { friendRequests: currentUserID } }; // xóa
    const result = await handleUpdate(friendUserID, updateAction);
    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no change made!" });
    }
    res.status(200).json({
      message:
        action === "add"
          ? "Friend request sent successfully!"
          : "Friend request canceled successfully!",
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Error processing request" });
  }
};
const handleActionFriend = async (req, res, action) => {
  const { friendID, currentUserID } = req.body;
  const updateActions =
    action === "agree"
      ? [
          {
            updateOne: {
              filter: { userID: currentUserID },
              update: {
                $addToSet: { friends: friendID }, // Thêm friendID vào danh sách bạn bè của currentUserID
                $pull: { friendRequests: friendID }, // Xóa friendID khỏi danh sách yêu cầu kết bạn
              },
            },
          },
          {
            updateOne: {
              filter: { userID: friendID },
              update: {
                $addToSet: { friends: currentUserID }, // Thêm currentUserID vào danh sách bạn bè của friendID
                $pull: { friendRequests: currentUserID }, // Xóa currentUserID khỏi danh sách yêu cầu kết bạn
              },
            },
          },
        ]
      : [
          {
            updateOne: {
              filter: { userID: currentUserID },
              update: {
                $pull: { friends: friendID, friendRequests: friendID }, // Xóa friendID khỏi danh sách bạn bè và yêu cầu kết bạn
              },
            },
          },
          {
            updateOne: {
              filter: { userID: friendID },
              update: {
                $pull: {
                  friends: currentUserID,
                  friendRequests: currentUserID,
                }, // Xóa currentUserID khỏi danh sách bạn bè và yêu cầu kết bạn
              },
            },
          },
        ];

  try {
    // Thực hiện cập nhật đồng thời cho cả hai người dùng
    const bulkResult = await UserModel.bulkWrite(updateActions);

    // Kiểm tra kết quả để đảm bảo rằng cả hai đều đã được cập nhật
    if (bulkResult.modifiedCount < 2) {
      return res.status(400).json({ message: "Update failed!" });
    }

    // Nếu không cần lấy lại toàn bộ dữ liệu, chỉ trả về thông báo thành công
    res.status(200).json({
      message:
        action === "agree"
          ? "Friend request accepted successfully!"
          : "Friend request rejected!",
    });
  } catch (error) {
    console.error("Error handling friend request:", error);
    res.status(500).json({ message: "Error handling friend request" });
  }
};
const handleRemoveFriend = async (req, res) => {
  const { friendUserID, currentUserID } = req.body;
  const updateAction = { $addToSet: { removeFriends: friendUserID } };
  try {
    const result = await handleUpdate(currentUserID, updateAction);
    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no change made!" });
    }

    res.status(200).json({
      message: "Update remove friend successfully!",
    });
  } catch (error) {
    console.log("Update remove fail", error);
    res.status(500).json({ message: "Update remove failed", error });
  }
};
const getFilteredUsers = async (filter, existingUser) => {
  const { userID, friends, removeFriends, friendRequests } = existingUser;

  switch (filter) {
    case "requests":
      // Lấy người dùng có yêu cầu kết bạn
      return friendRequests.length > 0
        ? await handleUsersRequest(friendRequests)
        : null;

    case "suggestfriend":
      // Lấy gợi ý bạn bè trừ bạn hiện tại, đã là bạn hoặc đã bị remove
      return await UserModel.find({
        userID: { $ne: userID, $nin: [...friends, ...removeFriends] },
      }).lean();

    default:
      // Mặc định trả về danh sách bạn bè
      return friends.length > 0 ? await handleUsersRequest(friends) : null;
  }
};
const formatUserData = (users) => {
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

module.exports = {
  getUser,
  handleUsersRequest,
  handleUserAction,
  handleActionFriend,
  handleUpdate,
  handleRemoveFriend,
  getFilteredUsers,
  formatUserData
};
