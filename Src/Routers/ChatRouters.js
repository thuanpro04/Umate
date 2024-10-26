const Router = require("express");
const {
  receiveMessageUsers,
  getAllConversationUsers,

} = require("../Controller/ChatController");
const chatRouter = Router();
chatRouter.get("/receive-messages", receiveMessageUsers);
chatRouter.get("/get-all-conversation", getAllConversationUsers);
module.exports = chatRouter;
