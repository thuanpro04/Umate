const { UserModel } = require("../models/usersModel");
const {
  findUserById,
  updateOneProfileInfo,
  filterUsers,
  transformUserData,
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
const setUpProfileInfo= async(req, res) =>{
  updateOneProfileInfo(req, res)
}
module.exports = {
  getAllUsers,
  setUpProfileInfo
};
