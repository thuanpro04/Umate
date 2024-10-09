const { UserModel } = require("../models/usersModel");

const findUserById = async (userID) => {
  return await UserModel.findOne({ userID: userID }).lean();
};

const updateUserById = async (userID, updateAction) => {
  const result = await UserModel.updateOne({ userID: userID }, updateAction);
  return result;
};
const handleFriendRequestAction = async (req, res, action) => {
  const { friendUserID, currentUserID } = req.body;
  try {
    // Tìm thông tin người dùng
    // Thực hiện hành động thêm hoặc hủy kết bạn
    const updateAction =
      action === "add"
        ? { $addToSet: { friendRequests: currentUserID } } //thêm ko trùng lập
        : { $pull: { friendRequests: currentUserID } }; // xóa
    const result = await updateUserById(friendUserID, updateAction);
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

const manageFriendship = async (req, res, action) => {
  const { friendUserID, currentUserID } = req.body;
  const updateActions =
    action === "agree"
      ? [
          {
            updateOne: {
              filter: { userID: currentUserID },
              update: {
                $addToSet: { friends: friendUserID }, // Thêm friendUserID vào danh sách bạn bè của currentUserID
                $pull: { friendRequests: friendUserID }, // Xóa friendUserID khỏi danh sách yêu cầu kết bạn
              },
            },
          },
          {
            updateOne: {
              filter: { userID: friendUserID },
              update: {
                $addToSet: { friends: currentUserID }, // Thêm currentUserID vào danh sách bạn bè của friendUserID
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
                $pull: { friends: friendUserID, friendRequests: friendUserID }, // Xóa friendUserID khỏi danh sách bạn bè và yêu cầu kết bạn
              },
            },
          },
          {
            updateOne: {
              filter: { userID: friendUserID },
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
const removeFriendSuggestion = async (req, res) => {
  const { friendUserID, currentUserID } = req.body;
  const updateAction = { $addToSet: { removeFriends: friendUserID } }; // Thêm friendUserID vào mảng removeFriends

  try {
    // Thực hiện cập nhật
    const result = await updateUserById(currentUserID, updateAction);

    // Kiểm tra xem có sự thay đổi nào không (nếu không thay đổi, result.modifiedCount sẽ là 0)
    if (!result.modifiedCount) {
      return res
        .status(404)
        .json({ message: "No changes made or user not found!" });
    }
    // Trả về thông báo thành công
    return res.status(200).json({
      message: "Friend removed successfully!",
    });
  } catch (error) {
    // Trả về chi tiết lỗi nếu có
    console.error("Failed to update remove friend:", error);
    res.status(500).json({ message: "Failed to remove friend", error });
  }
};
const getUsersByIds = async (userFriends) => {
  users = await UserModel.find({ userID: { $in: userFriends } }).lean();
  return users;
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
const processRemoveFriendAction = async (req, res) => {
  const { friendUserID, currentUserID } = req.body;

  const updateActions = [
    {
      updateOne: {
        filter: { userID: currentUserID },
        update: {
          $pull: { friends: friendUserID },          // Xóa friendUserID khỏi danh sách bạn bè
          $addToSet: { removeFriends: friendUserID } // Thêm friendUserID vào danh sách đã xóa
        },
      },
    },
    {
      updateOne: {
        filter: { userID: friendUserID },
        update: {
          $pull: { friends: currentUserID } // Xóa currentUserID khỏi danh sách bạn bè
        },
      },
    },
  ];
  try {
    // Thực hiện cập nhật đồng thời cho cả hai người dùng
    const bulkResult = await UserModel.bulkWrite(updateActions);
    // Kiểm tra kết quả để đảm bảo rằng cả hai đều đã được cập nhật
    const totalModified = bulkResult.modifiedCount;

    if (totalModified < 2) {
      return res.status(400).json({ message: "Update failed!" });
    }

    return res.status(200).json({
      message: "Delete friend successfully!!!",
    });
  } catch (error) {
    console.error("Delete friend fail:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the friend.",
    });
  }
};


module.exports = {
  findUserById,
  getUsersByIds,
  handleFriendRequestAction,
  manageFriendship,
  updateUserById,
  removeFriendSuggestion,
  filterUsers,
  transformUserData,
  processRemoveFriendAction,
};
