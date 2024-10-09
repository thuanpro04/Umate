const { UserModel } = require("../models/usersModel");
const {
  findUserById,
  getUsersByIds,
  handleFriendRequestAction,
  manageFriendship,
  updateUserById,
  removeFriendSuggestion,
  filterUsers,
  transformUserData,
  processRemoveFriendAction,
} = require("../Services/userServices");

const getAllUsers = async (req, res) => {
  const { currentUserID, filter } = req.query;

  try {
    // Lấy thông tin người dùng hiện tại
    const existingUser = await findUserById(currentUserID);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    }
    // Lọc danh sách người dùng dựa trên filter
    const filteredUsers = await filterUsers(filter, existingUser);
    // Định dạng dữ liệu người dùng trước khi trả về
    const formattedData = transformUserData(filteredUsers);
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
  handleFriendRequestAction(req, res, "add");
};

const handleCancelFriend = (req, res) => {
  handleFriendRequestAction(req, res, "cancel");
};

const handleAgreeFriend = async (req, res) => {
  manageFriendship(req, res, "agree");
};
const handlePressRemoveSuggest = async (req, res) => {
  removeFriendSuggestion(req, res);
};

const handleRemoveFriends= async(req, res)=>{
  processRemoveFriendAction(req, res)
  
}
module.exports = {
  getAllUsers,
  handleAddFriends,
  handleCancelFriend,
  handleAgreeFriend,
  handlePressRemoveSuggest,
  handleRemoveFriends
};
