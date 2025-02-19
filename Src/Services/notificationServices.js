const adminfirebase = require("firebase-admin");
const serviceAccount = require("./../untils/umatefirebase.json");
const { findUserById, updateFcmToken } = require("./userServices");
const {
  ConversationModel,
  GroupConversationModel,
} = require("../models/usersModel");
const { notificationModel } = require("../models/notificationModel");

adminfirebase.initializeApp({
  credential: adminfirebase.credential.cert(serviceAccount),
});
async function getAccessToken() {
  const token = await adminfirebase.credential
    .cert(serviceAccount)
    .getAccessToken();
  return token.access_token;
}
const getFcmTokenForUser = async (userId) => {
  const user = await findUserById(userId);
  return user;
};
const getListFcmTokenUser = async (listId) => {
  const userPromises = listId.map((userId) => findUserById(userId));
  const listUserInfo = await Promise.all(userPromises);
  const validUsers = listUserInfo.filter(
    (user) => user && user.fcmTokens && user.fcmTokens.length > 0
  );
  const fcmTokens = validUsers.flatMap((user) => user.fcmTokens);
  return { fcmTokens };
};
const handleSendNotification = async (userId, content, key, currentUserId) => {
  const user =
    key === "personal"
      ? await getFcmTokenForUser(userId)
      : await getListFcmTokenUser(userId);
  const userInfo = await findUserById(currentUserId);
  if (user && user.fcmTokens && user.fcmTokens.length > 0) {
    for (const token of user.fcmTokens) {
      const messages = {
        token: token,
        notification: {
          title: userInfo.name,
          body: content ?? "",
        },
      };
      try {
        await adminfirebase.messaging().send(messages);
        console.log("Successfully sent message to:", token);
      } catch (error) {
        console.log("Error sending message:", error);
      }
    }
  } else {
    console.log("No FCM tokens found for user:", userId);
  }
};
const updateNotificationGroup = async (userId, converId) => {
  const groupConv = await GroupConversationModel.findOne({
    groupId: converId,
  });
  if (groupConv.notification.includes(userId)) {
    const index = groupConv.notification.indexOf(userId);
    if (index !== -1) {
      groupConv.notification.splice(index, 1);
    }
  } else {
    groupConv.notification.push(userId);
  }
  await groupConv.save();
};
const updateNotificationPersonal = async (userId, converId) => {
  const conv = await ConversationModel.findOne({
    conversationId: converId,
  });
  if (conv.notification.includes(userId)) {
    const index = conv.notification.indexOf(userId);
    if (index !== -1) {
      conv.notification.splice(index, 1);
    }
  } else {
    conv.notification.push(userId);
  }
  await conv.save();
};
const handleActionNotification = async (req, res) => {
  const { userId, converId, key } = req.body;
  console.log(userId, converId, key);

  try {
    if (key === "personal") {
      await updateNotificationPersonal(userId, converId);
      console.log("Update personal successfully");
    } else {
      await updateNotificationGroup(userId, converId);
      console.log("Update group successfully");
    }
    res.status(200).json({
      message: "update action notification successfully !!",
      data: [],
    });
  } catch (error) {
    console.log("Action notification fail error: ", error);
  }
};
const addNotificationForUser = async (currentUserId, userId, content, type) => {
  const user = await findUserById(currentUserId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const userIds = Array.isArray(userId) ? userId : [userId];
  const notifications = userIds.map((receiverId) => ({
    senderId: currentUserId,
    receiverId,
    title: user.name,
    content,
    type,
  }));
  await notificationModel.insertMany(notifications);
  console.log("Notified for user !!");
};
const handleActionInviteToGroup = async (req, res) => {
  const { currentUserId, userId, content } = req.body;
  try {
    await addNotificationForUser(currentUserId, userId, content, "groupInvite");
    res.status(200).json({
      message: "Invite to group successfully",
      data: [],
    });

    console.log("Invite to group successfully");
  } catch (error) {
    console.log("Invite to group error: ", error);
  }
};
const handleGetNotifications = async (req, res) => {
  const { userId } = req.query;
  try {
    const result = await notificationModel.find({ receiverId: userId });
    res.status(200).json({
      message: "Notification successfully !!",
      data: result,
    });
  } catch (error) {
    console.log("get notification error: ", error);
  }
};
const handleActionDeleteNotification = async (req, res) => {
  const { id } = req.query;
  try {
    console.log(id);

    const result = await notificationModel.findByIdAndDelete(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy thông báo để xóa." });
    }

    res.status(200).json({ message: "Xóa thông báo thành công!" });
  } catch (error) {
    console.log("Delete notification fail error: ", error);
  }
};
module.exports = {
  handleSendNotification,
  handleActionNotification,
  handleActionInviteToGroup,
  handleGetNotifications,
  addNotificationForUser,
  handleActionDeleteNotification,
};
