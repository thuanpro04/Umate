const Router = require("express");
const {
  receiveMessageUsers,
  getAllConversationUsers,
  checkConversation,
} = require("../Controller/ChatController");
const chatRouter = Router();
chatRouter.get("/receive-messages", receiveMessageUsers);
chatRouter.get("/get-all-conversation", getAllConversationUsers);
chatRouter.post("/new-conversation", checkConversation);
module.exports = chatRouter;
