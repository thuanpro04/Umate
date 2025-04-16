const adminfirebase = require("firebase-admin");
const nodemailer = require("nodemailer");
// const serviceAccount = require("./../untils/umatefirebase.json");
const { findUserById } = require("./userServices");

const { notificationModel } = require("../models/notificationModel");
const mongoose = require("mongoose");
const { GroupConversationModel } = require("../models/groupConversationModel");
const { ConversationModel } = require("../models/personalConversationModel");
// adminfirebase.initializeApp({
//   credential: adminfirebase.credential.cert(serviceAccount),
// });
// async function getAccessToken() {
//   const token = await adminfirebase.credential
//     .cert(serviceAccount)
//     .getAccessToken();
//   return token.access_token;
// }

// const getFcmTokenForUser = async (userId) => {
//   const user = await findUserById(userId);
//   return user;
// };
// const getListFcmTokenUser = async (listId) => {
//   const userPromises = listId.map((userId) => findUserById(userId));
//   const listUserInfo = await Promise.all(userPromises);
//   const validUsers = listUserInfo.filter(
//     (user) => user && user.fcmTokens && user.fcmTokens.length > 0
//   );
//   const fcmTokens = validUsers.flatMap((user) => user.fcmTokens);
//   return { fcmTokens };
// };
// const removeFcmToken = async (userId, token) => {
//   try {
//     await UserModel.updateOne({ userId }, { $pull: { fcmTokens: token } });
//     console.log(`🧹 Token ${token} đã được xóa khỏi user ${userId}.`);
//   } catch (err) {
//     console.log("❗ Lỗi khi xóa FCM token:", err);
//   }
// };
// const handleSendNotification = async (
//   userId,
//   content,
//   key,
//   currentUserId,
//   title
// ) => {
//   const user =
//     key === "personal"
//       ? await getFcmTokenForUser(userId)
//       : await getListFcmTokenUser(userId);
//   const userInfo = await findUserById(currentUserId);
//   if (user && user.fcmTokens && user.fcmTokens.length > 0) {
//     for (const token of user.fcmTokens) {
//       const messages = {
//         token: token,
//         notification: {
//           title: title ? `${title} ${userInfo.name}` : userInfo.name,
//           body: content ?? "",
//         },
//       };
//       try {
//         await adminfirebase.messaging().send(messages);
//         console.log("Successfully sent message to:", token);
//       } catch (error) {
//         console.log("Error sending message:", error);
//         if (
//           error?.errorInfo?.code ===
//           "messaging/registration-token-not-registered"
//         ) {
//           console.log("⚠️ FCM token not registered. Removing token:", token);
//           // 👉 Xóa token không hợp lệ
//           await removeFcmToken(userId, token);
//           // 👉 Yêu cầu cập nhật token mới nếu có
//           const updatedToken = await getFcmTokenForUser(userId);
//           if (updatedToken && updatedToken.fcmTokens.length > 0) {
//             console.log("🔄 Cập nhật FCM token mới:", updatedToken.fcmTokens);
//           } else {
//             console.log("🚫 Không tìm thấy FCM token mới.");
//           }
//         }
//       }
//     }
//   } else {
//     console.log("No FCM tokens found for user:", userId);
//   }
// };

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
  return conv.notification;
};
const handleActionNotification = async (req, res) => {
  const { userId, converId, key } = req.body;
  console.log(userId, converId, key);
  try {
    if (key === "personal") {
      result = await updateNotificationPersonal(userId, converId);
      console.log("Update personal successfully");
    } else {
      result = await updateNotificationGroup(userId, converId);
      console.log("Update group successfully");
    }
    res.status(200).json({
      message: "update action notification successfully !!",
      data: userId,
    });
  } catch (error) {
    console.log("Action notification fail error: ", error);
  }
};
const addNotificationForUser = async (
  id,
  currentUserId,
  userId,
  content,
  type,
  title,
  data,
  postId
) => {
  const user = await findUserById(currentUserId);
  const userIds = Array.isArray(userId) ? userId : [userId];
  const notifications = userIds.map((receiverId) => ({
    groupId: id,
    senderId: currentUserId,
    receiverId,
    title:
      type === "groupInvite" ? `${title} - ${user.name}` : title ?? user.name,
    content,
    type,
    data,
    postId,
  }));
  await notificationModel.insertMany(notifications);
  console.log("Notified for user !!");
};

const handleActionInviteToGroup = async (req, res) => {
  const { id, currentUserId, userId, content, title } = req.body;
  try {
    await addNotificationForUser(
      id,
      currentUserId,
      userId,
      content,
      "groupInvite",
      title
    );
    res.status(200).json({
      message: "Invite to group successfully",
      data: [],
    });
  } catch (error) {
    console.log("Invite to group error: ", error);
  }
};
const handleGetNotifications = async (req, res) => {
  const { userId } = req.query;
  try {
    const result = await notificationModel.find({ receiverId: userId });
    await notificationModel.updateMany(
      { receiverId: userId, status: { $ne: "read" } },
      { $set: { status: "read" } }
    );
    res.status(200).json({
      message: "Notification successfully !!",
      data: result.reverse(),
    });
  } catch (error) {
    console.log("get notification error: ", error);
  }
};

const deletedNotification = async (id) => {
  let idsArray;

  // Nếu id là mảng, giữ nguyên
  if (Array.isArray(id)) {
    idsArray = id;
  }
  // Nếu id là chuỗi có dấu phẩy (danh sách id), tách thành mảng
  else if (typeof id === "string" && id.includes(",")) {
    idsArray = id.split(",");
  }
  // Nếu id là một chuỗi ObjectId duy nhất
  else {
    idsArray = [id];
  }

  // Chuyển tất cả id thành ObjectId hợp lệ
  const objectIds = idsArray.map((item) => new mongoose.Types.ObjectId(item));

  // Xóa tất cả thông báo theo danh sách ID
  const result = await notificationModel.deleteMany({
    _id: { $in: objectIds },
  });
  return result.deletedCount > 0 ? idsArray : [];
};

const handleActionDeleteNotification = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await deletedNotification(id);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông báo để xóa." });
    }

    res
      .status(200)
      .json({ message: "Xóa thông báo thành công!", data: result });
  } catch (error) {
    console.log("Delete notification fail error: ", error);
  }
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USERNAME_EMAIL,
    pass: process.env.PASSWORD,
  },
});
const handleActionSendEmail = async (req, res) => {
  const { name, email, message } = req.body;
  const emailOptions = {
    from: `📩 Xin chào từ ứng dụng của bạn> ${process.env.USERNAME_EMAIL} `,
    to: email,
    subject: name,
    text: message,
  };
  try {
    await transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.log("❌ Lỗi khi gửi email:", error);
      } else {
        console.log("✅ Email đã được gửi thành công:", info.response);
      }
    });
    res.status(200).json({ message: "Send email successfully!!" });
  } catch (error) {
    console.log("Action send email fail error: ", error);
  }
};
const handleActionCheckNotification = async (req, res) => {
  const { userId } = req.query;
  try {
    const lastNotification = await notificationModel
      .findOne({
        receiverId: userId,
      })
      .sort({ timestamp: -1 })
      .select("status");
    if (!lastNotification) {
      return res.status(401).json({
        message: "No notifications found!",
      });
    }
    return res.status(200).json({
      message: "Check notification successfully!!",
      data: lastNotification,
    });
  } catch (error) {
    console.log("Check notifi error: ", error);
  }
};
module.exports = {
  handleActionNotification,
  handleActionInviteToGroup,
  handleGetNotifications,
  addNotificationForUser,
  handleActionDeleteNotification,
  deletedNotification,
  handleActionSendEmail,
  handleActionCheckNotification,
};
