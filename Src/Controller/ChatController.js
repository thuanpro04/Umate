const {
  handleReceiveMessageUsers,
  handleGetAllConversationUsers,handleSearchConversations
} = require("../Services/chatServices");

const receiveMessageUsers = async (req, res) => {
  handleReceiveMessageUsers(req, res);
};
const getAllConversationUsers = async (req, res) => {
  handleGetAllConversationUsers(req,res);
};
const getConversationUsers = async(req, res) =>{
  handleSearchConversations(req,res)
}
module.exports = {
  receiveMessageUsers,
  getAllConversationUsers,
  getConversationUsers
};
