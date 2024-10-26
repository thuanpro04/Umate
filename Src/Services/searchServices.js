const { UserModel } = require("../models/usersModel");
const { transformUserData } = require("./userServices");

const handleSearchByName = async (searchTerm, currentUserID) => {
  const users = await UserModel.find({
    $or: [
      { name: { $regex: searchTerm, $options: "i" } }, // Tìm theo tên
    ],
    userID: { $nin: [currentUserID] }, // Không bao gồm người dùng hiện tại
  });
  if (searchTerm === "") {
    return transformUserData(users);
  }
  return transformUserData(users);
};
const searchFriendByName = async (req, res) => {
  const { searchTerm, currentUserID } = req.query;
  //$regex là toán tử để tìm kiếm chuỗi theo biểu thức chính quy (regular expression).
  //$options: "i" cho phép tìm kiếm không phân biệt chữ hoa chữ thường (case-insensitive).

  try {
    if (searchTerm !== "") {
      const data = await handleSearchByName(searchTerm, currentUserID);
      console.log(data);
      if (data.length === 0) {
        return res.status(200).json({
          message: "User not found !!!",
        });
      }
      return res.status(200).json({
        message: "Search users successlly!!!",
        data,
      });
    }
  } catch (error) {
    console.log("searchFriendByName fail", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const handleSearchConversations = async (req, res) => {
  const { currentUserID, keyWord } = req.query;
  try {
    const data = await handleSearchByName(keyWord, currentUserID);
    if (keyWord === "") {
      const userSuggests = data.slice(0, 3);
      return res.status(200).json({
        message: "Conversation not found !!!",
        data: userSuggests,
      });
    }
    return res.status(200).json({
      message: "Search conversations successfully !!!",
      data,
    });
  } catch (error) {
    console.log("handleSearchConversation", error);
  }
};
module.exports = {
  searchFriendByName,
  handleSearchByName,handleSearchConversations
};
