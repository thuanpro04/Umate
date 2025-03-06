const {
  handleReceiveMessageUsers,
  handleGetAllConversationUsers,
  handleCheckConversation,
  handleActionBlockUserConversation,
  handleUpdateStatusMessage,
  handleDeleteConversation
} = require("../Services/chatServices");

const receiveMessageUsers = async (req, res) => {
  handleReceiveMessageUsers(req, res);
};
const getAllConversationUsers = async (req, res) => {
  handleGetAllConversationUsers(req, res);
};
const checkConversation = async (req, res) => {
  handleCheckConversation(req, res);
};
const updateStatusMessage = (req, res) => {
  handleUpdateStatusMessage(req, res);
};
const deleteConversation=(req,res) =>{
  handleDeleteConversation(req,res)
}
module.exports = {
  receiveMessageUsers,
  getAllConversationUsers,
  checkConversation,
  updateStatusMessage,deleteConversation
};
