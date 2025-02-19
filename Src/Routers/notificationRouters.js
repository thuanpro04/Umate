const express = require("express");
const {
  actionNotification,
  actionInviteToGroup,
  getNotifications,
  actionDeleteNotification
} = require("../Controller/notificationController");
const notificationRouter = express();
notificationRouter.post("/action-notifi", actionNotification);
notificationRouter.post("/invite-group", actionInviteToGroup);
notificationRouter.get("/get-notifi", getNotifications);
notificationRouter.get('/delete', actionDeleteNotification)
module.exports = notificationRouter;
