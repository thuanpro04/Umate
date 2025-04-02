const { GroupConversationModel } = require("../models/groupConversationModel");
const {
  UserModel,
} = require("../models/usersModel");  
const { transformUserData, findUserById } = require("./userServices");
const handleSearchByName = async (searchTerm, currentUserId, bySearch) => {
  const user = await findUserById(currentUserId);
  console.log(searchTerm, currentUserId, bySearch);

  let searchConditions = [{ name: { $regex: searchTerm, $options: "i" } }];
  if (bySearch && bySearch.length > 0) {
    if (bySearch.includes("className") && user.className) {
      searchConditions.push({ className: user.className });
    }
    if (bySearch.includes("friends") && user.friends && user.friends.length > 0) {
      searchConditions.push({ userId: { $in: user.friends } });
    }
    if (bySearch.includes("majorCategory") && user.majorCategory) {
      searchConditions.push({ majorCategory: user.majorCategory });
    }
  }

  if (searchConditions.length === 0 && bySearch.length > 0) return [];

  const users = await UserModel.find({
    $and: [
      ...searchConditions,
      { userId: { $nin: [currentUserId] } },
    ],
  });

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
