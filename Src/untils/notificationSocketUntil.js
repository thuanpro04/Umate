const { sendNotificationCallToUser } = require("../Services/socketService");

const handleNotificationSocket = (data) => {
  sendNotificationCallToUser(data.receiverId, "notification_message", data);
};
module.exports = {
  handleNotificationSocket,
};
