const Router = require("express");
const {
  receiveMessageUsers,
  getAllConversationUsers,
  getConversationUsers,
} = require("../Controller/ChatController");
const chatRouter = Router();
chatRouter.get("/receive-messages", receiveMessageUsers);
chatRouter.get("/get-all-conversation", getAllConversationUsers);
chatRouter.get('/search-conversations', getConversationUsers)
module.exports = chatRouter;
