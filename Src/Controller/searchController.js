const {
  searchFriendByName,
  handleSearchConversations,
  handleFindFrienForUser
} = require("../Services/searchServices");

const handleSearchFriendsByName = async (req, res) => {
  searchFriendByName(req, res);
};
const getConversationUsers = async (req, res) => {
  handleSearchConversations(req, res);
};
const findFrienForUser = (req, res) => {
  
  handleFindFrienForUser(req,res)
};
module.exports = {
  handleSearchFriendsByName,
  getConversationUsers,
  findFrienForUser,
};
