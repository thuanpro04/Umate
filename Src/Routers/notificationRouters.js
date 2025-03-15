const express = require("express");
const {
  actionNotification,
  actionInviteToGroup,
  getNotifications,
  actionDeleteNotification,actionSendEmail
} = require("../Controller/notificationController");

const notificationRouter = express();
notificationRouter.post("/action-notifi", actionNotification);
notificationRouter.post("/invite-group", actionInviteToGroup);
notificationRouter.get("/get-notifi", getNotifications);
notificationRouter.get('/delete', actionDeleteNotification)
notificationRouter.post('/send-email', actionSendEmail)
module.exports = notificationRouter;
