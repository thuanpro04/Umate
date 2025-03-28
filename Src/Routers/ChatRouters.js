const Router = require("express");
const {
  receiveMessageUsers,
  getAllConversationUsers,
  checkConversation,
  updateStatusMessage,
  deleteConversation,
  getImages,
  getLinkYourConversation,
  updateNickNameConversation,
  updateThemeConversation,
  actionGhimConversation,
} = require("../Controller/ChatController");
const chatRouter = Router();
chatRouter.get("/receive-messages", receiveMessageUsers);
chatRouter.get("/get-all-conversation", getAllConversationUsers);
chatRouter.post("/new-conversation", checkConversation);
chatRouter.post("/update-status-message", updateStatusMessage);
chatRouter.post("/delete-conver", deleteConversation);
chatRouter.get("/get-images", getImages);
chatRouter.get("/get-link", getLinkYourConversation);
chatRouter.post("/update-nickname", updateNickNameConversation);
chatRouter.post("/update-theme", updateThemeConversation);
chatRouter.post("/ghim", actionGhimConversation);
module.exports = chatRouter;
