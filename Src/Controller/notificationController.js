const {
  handleActionNotification,
} = require("../Services/notificationServices");

const actionNotification = (req, res) => {
  handleActionNotification(req, res);
};
module.exports = { actionNotification };
