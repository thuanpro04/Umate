const {
  findUserById,
  updateOneProfileInfo,
  filterUsers,
  transformUserData,
  handleGetUserInfoById,
  handleListUserForHeartEvent,
  handleUpdateStatusUser,
  handleActionBlockUser,
  handleUpdateFcmTokenForUser,
  handleUpdateThemeForUser,
  handleActionRemoveUser,
  handleUpdateLanguge
} = require("../Services/userServices");

const getAllUsers = async (req, res) => {
  const { currentUserId, filter } = req.query;
  try {
    const existingUser = await findUserById(currentUserId);
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
const updateStatusUser = (req, res) => {
  handleUpdateStatusUser(req, res);
};
const setUpProfileInfo = async (req, res) => {
  updateOneProfileInfo(req, res);
};
const getUserInfo = async (req, res) => {
  handleGetUserInfoById(req, res);
};

const getListUserForHeartEvent = (req, res) => {
  handleListUserForHeartEvent(req, res);
};
const actionBlockUser = (req, res) => {
  handleActionBlockUser(req, res);
};
const updateFcmTokenForUser = (req, res) => {
  handleUpdateFcmTokenForUser(req, res);
};
const updateThemForUser = (req, res) => {
  handleUpdateThemeForUser(req, res);
};
const actionRemoveUser = (req, res) => {
  handleActionRemoveUser(req, res);
};
const updateLanguageForUser = (req, res) => {
  handleUpdateLanguge(req,res)
};
module.exports = {
  getAllUsers,
  setUpProfileInfo,
  getUserInfo,
  getListUserForHeartEvent,
  updateStatusUser,
  actionBlockUser,
  updateFcmTokenForUser,
  updateThemForUser,
  actionRemoveUser,
  updateLanguageForUser,
};
