const {
  handleActionNotification,
  handleActionInviteToGroup,
  handleGetNotifications,
  handleActionDeleteNotification,
  handleActionSendEmail,handleActionCheckNotification
} = require("../Services/notificationServices");

const actionNotification = (req, res) => {
  handleActionNotification(req, res);
};
const actionInviteToGroup = (req, res) => {
  handleActionInviteToGroup(req, res);
};
const getNotifications = (req, res) => {
  handleGetNotifications(req, res);
};
const actionDeleteNotification = (req, res) => {
  handleActionDeleteNotification(req, res);
};

const actionSendEmail = (req, res) => {
  handleActionSendEmail(req, res);
};
const actionCheckNotification=(req,res) =>{
  handleActionCheckNotification(req,res)
}
module.exports = {
  actionNotification,
  actionInviteToGroup,
  getNotifications,
  actionDeleteNotification,
  actionSendEmail,
  actionCheckNotification,
};
