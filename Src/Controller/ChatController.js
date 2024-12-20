const {
  handleReceiveMessageUsers,
  handleGetAllConversationUsers,
} = require("../Services/chatServices");

const receiveMessageUsers = async (req, res) => {

  handleReceiveMessageUsers(req, res);
};
const getAllConversationUsers = async (req, res) => {
  handleGetAllConversationUsers(req, res);
};

module.exports = {
  receiveMessageUsers,
  getAllConversationUsers,
};
