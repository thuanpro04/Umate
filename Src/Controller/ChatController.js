const {
  handleReceiveMessageUsers,
  handleGetAllConversationUsers,
  handleCheckConversation,
  handleActionBlockUserConversation,
  handleUpdateStatusMessage,
  handleDeleteConversation,
  handleGetImageForConversation,
  handleGetLink,
  handleUpdateNickName,
  handleUpdateThemeConversation,
  handleUpdateAttendedGroup,
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
const deleteConversation = (req, res) => {
  handleDeleteConversation(req, res);
};
const getImages = (req, res) => {
  handleGetImageForConversation(req, res);
};
const getLinkYourConversation = async (req, res) => {
  handleGetLink(req, res);
};
const updateNickNameConversation = (req, res) => {
  handleUpdateNickName(req, res);
};
const updateThemeConversation = (req, res) => {
  handleUpdateThemeConversation(req, res);
};
const updateAttendedGroup = async (req, res) => {
  handleUpdateAttendedGroup(req, res);
};
module.exports = {
  receiveMessageUsers,
  getAllConversationUsers,
  checkConversation,
  updateStatusMessage,
  deleteConversation,
  getImages,
  getLinkYourConversation,
  updateNickNameConversation,
  updateThemeConversation,
  updateAttendedGroup,
};
