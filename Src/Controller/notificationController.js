const {
  handleActionNotification,
  handleActionInviteToGroup,
  handleGetNotifications,handleActionDeleteNotification
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
const actionDeleteNotification=(req,res)=>{
  handleActionDeleteNotification(req,res)
}
module.exports = { actionNotification, actionInviteToGroup, getNotifications ,actionDeleteNotification};
