const { UserModel } = require("../models/usersModel");
const {
  getUser,
  handleUsersRequest,
  handleUserAction,
  handleActionFriend,
  handleUpdate,
  handleRemoveFriend,
  getFilteredUsers,
  formatUserData,
} = require("../Services/userServices");

const getAllUsers = async (req, res) => {
  const { currentUserID, filter } = req.query;

  try {
    // Lấy thông tin người dùng hiện tại
    const existingUser = await getUser(currentUserID);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    }
    // Lọc danh sách người dùng dựa trên filter
    const filteredUsers = await getFilteredUsers(filter, existingUser);
    // Định dạng dữ liệu người dùng trước khi trả về
    const formattedData = formatUserData(filteredUsers);
    // Trả về dữ liệu thành công
    res.status(200).json({
      message: "Get users successfully!!!",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const handleAddFriends = (req, res) => {
  handleUserAction(req, res, "add");
};

const handleCancelFriend = (req, res) => {
  handleUserAction(req, res, "cancel");
};

const handleAgreeFriend = async (req, res) => {
  handleActionFriend(req, res, "agree");
};
const handlePressRemove = async (req, res) => {
  handleRemoveFriend(req, res);
};
const getYourFriends = async (req, res) => {};
module.exports = {
  getAllUsers,
  handleAddFriends,
  handleCancelFriend,
  handleAgreeFriend,
  getYourFriends,
  handlePressRemove,
};
