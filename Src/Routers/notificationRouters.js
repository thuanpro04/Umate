const express = require("express");
const { actionNotification } = require("../Controller/notificationController");
const notificationRouter = express();
notificationRouter.post("/action-notifi", actionNotification);
module.exports = notificationRouter;
