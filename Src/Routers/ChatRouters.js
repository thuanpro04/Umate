const Router = require("express");
const { receiveMessageUsers } = require("../Controller/ChatController");
const chatRouter = Router();
chatRouter.get("/receive-messages", receiveMessageUsers);
module.exports = chatRouter;
