const Router = require("express");
const {
  receiveMessageUsers,
  getAllConversationUsers,
  checkConversation,
  updateStatusMessage,
  deleteConversation
} = require("../Controller/ChatController");
const chatRouter = Router();
chatRouter.get("/receive-messages", receiveMessageUsers);
chatRouter.get("/get-all-conversation", getAllConversationUsers);
chatRouter.post("/new-conversation", checkConversation);
chatRouter.post('/update-status-message', updateStatusMessage)
chatRouter.post('/delete-conver', deleteConversation)
module.exports = chatRouter;
