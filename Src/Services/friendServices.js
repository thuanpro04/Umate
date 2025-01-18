const { UserModel } = require("../models/usersModel");
const { updateUserById } = require("./userServices");

const handleFriendRequestAction = async (req, res, action) => {
  const { friendUserId, currentUserId } = req.body;
  console.log("add", req.body);
  
  try {
    // Tìm thông tin người dùng
    // Thực hiện hành động thêm hoặc hủy kết bạn
    const updateAction =
      action === "add"
        ? { $addToSet: { friendRequests: currentUserId } } //thêm ko trùng lập
        : { $pull: { friendRequests: currentUserId } }; // xóa
    const result = await updateUserById(friendUserId, updateAction);
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
  const { friendUserId, currentUserId } = req.body;
  console.log(req.body);
  
  const updateActions =
    action === "agree"
      ? [
          {
            updateOne: {
              filter: { userId: currentUserId },
              update: {
                $addToSet: { friends: friendUserId }, // Thêm friendUserId vào danh sách bạn bè của currentUserId
                $pull: { friendRequests: friendUserId }, // Xóa friendUserId khỏi danh sách yêu cầu kết bạn
              },
            },
          },
          {
            updateOne: {
              filter: { userId: friendUserId },
              update: {
                $addToSet: { friends: currentUserId }, // Thêm currentUserId vào danh sách bạn bè của friendUserId
                $pull: { friendRequests: currentUserId }, // Xóa currentUserId khỏi danh sách yêu cầu kết bạn
              },
            },
          },
        ]
      : [
          {
            updateOne: {
              filter: { userId: currentUserId },
              update: {
                $pull: { friends: friendUserId, friendRequests: friendUserId }, // Xóa friendUserId khỏi danh sách bạn bè và yêu cầu kết bạn
              },
            },
          },
          {
            updateOne: {
              filter: { userId: friendUserId },
              update: {
                $pull: {
                  friends: currentUserId,
                  friendRequests: currentUserId,
                }, // Xóa currentUserId khỏi danh sách bạn bè và yêu cầu kết bạn
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
  const { friendUserId, currentUserId } = req.body;
  const updateAction = { $addToSet: { removeFriends: friendUserId } }; // Thêm friendUserId vào mảng removeFriends

  try {
    // Thực hiện cập nhật
    const result = await updateUserById(currentUserId, updateAction);

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
const processRemoveFriendAction = async (req, res) => {
  const { friendUserId, currentUserId } = req.body;
  const updateActions = [
    {
      updateOne: {
        filter: { UserId: currentUserId },
        update: {
          $pull: { friends: friendUserId }, // Xóa friendUserId khỏi danh sách bạn bè
          $addToSet: { removeFriends: friendUserId }, // Thêm friendUserId vào danh sách đã xóa
        },
      },
    },
    {
      updateOne: {
        filter: { UserId: friendUserId },
        update: {
          $pull: { friends: currentUserId }, // Xóa currentUserId khỏi danh sách bạn bè
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
  removeFriendSuggestion,
  handleFriendRequestAction,
  manageFriendship,
  processRemoveFriendAction,
};
