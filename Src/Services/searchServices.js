const {
  UserModel,
  ConversationModel,
  GroupConversationModel,
} = require("../models/usersModel");


const { transformUserData, findUserById } = require("./userServices");
const handleSearchByName = async (searchTerm, currentUserId, bySearch) => {
  const user = await findUserById(currentUserId);
  // Khởi tạo mảng điều kiện tìm kiếm
  let searchConditions = [{ name: { $regex: searchTerm, $options: "i" } }];
  // Nếu có điều kiện tìm kiếm
  if (bySearch && bySearch.length > 0) {
    // Thêm các điều kiện vào searchConditions
    if (bySearch.includes("className")) {
      if (!user.className) return []; // Nếu className là undefined, trả về mảng rỗng
      searchConditions.push({ className: user.className });
    }
    if (bySearch.includes("friends")) {
      if (!user.friends || user.friends.length === 0) return []; // Nếu friends là undefined hoặc rỗng, trả về mảng rỗng
      searchConditions.push({ UserId: { $in: user.friends } });
    }
    if (bySearch.includes("majorCategory")) {
      if (!user.majorCategory) return []; // Nếu majorCategory là undefined, trả về mảng rỗng
      searchConditions.push({ majorCategory: user.majorCategory });
    }
  }
  // Nếu không có điều kiện nào, trả về mảng rỗng
  if (searchConditions.length === 0 && bySearch.length > 0) return [];

  // Thực hiện truy vấn MongoDB với điều kiện tìm kiếm
  const users = await UserModel.find({
    $and: [
      ...searchConditions, // Tìm theo các điều kiện đã xác định
      { userId: { $nin: [currentUserId] } }, // Loại trừ người dùng hiện tại
    ],
  });
  // console.log(users,currentUserId);

  // Nếu không có tìm kiếm, trả về danh sách người dùng
  if (searchTerm === "") {
    return transformUserData(users);
  }

  return transformUserData(users);
};

const searchFriendByName = async (req, res) => {
  const { searchTerm, currentUserId, titleSearch } = req.query;
  // console.log(req.query);
  const bySearch = titleSearch.split(",");

  //$regex là toán tử để tìm kiếm chuỗi theo biểu thức chính quy (regular expression).
  //$options: "i" cho phép tìm kiếm không phân biệt chữ hoa chữ thường (case-insensitive).
  try {
    if (searchTerm !== "") {
      const data = await handleSearchByName(
        searchTerm,
        currentUserId,
        bySearch
      );
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
const handleSearchKeyWordGroup = async (currentUserId, keyWord) => {
  try {
    const converUser = await GroupConversationModel.find({
      "invitedUsers.userId": currentUserId, // Lọc theo userId trong invitedUsers
      groupName: { $regex: keyWord, $options: "i" },
    });
    return converUser;
  } catch (error) {
    console.error("Lỗi handleSearchConversation:", error);
    return [];
  }
};
const handleSearchConversations = async (req, res) => {
  const { currentUserId, keyWord } = req.query;
  try {
    const searchByNameUser = await handleSearchByName(keyWord, currentUserId);
    const searchByGroupName = await handleSearchKeyWordGroup(
      currentUserId,
      keyWord
    );
    const data = [...searchByNameUser, ...searchByGroupName];
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
const handleFindFrienForUser = async (req, res) => {
  const { userId, keyWord } = req.query;
  // console.log(userId, keyWord);

  try {
    const currentUser = await findUserById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const friends = currentUser.friends;
    const filter = {
      userId: { $in: friends },
    };
    if (keyWord) {
      filter.name = { $regex: keyWord, $options: "i" };
    }
    const user = await UserModel.find(filter);
    console.log("dday", user, 125656);
    res.status(200).json({
      message: "find user successfully!!",
      data: user,
    });
  } catch (error) {
    console.log("handle find friend user fail error: ", error);
  }
};
module.exports = {
  searchFriendByName,
  handleSearchByName,
  handleSearchConversations,
  handleFindFrienForUser,
};
