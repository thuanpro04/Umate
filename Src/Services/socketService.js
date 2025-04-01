const socketIO = require("socket.io");
const {
  sendMessageToGroupAndPersonal,
  sendQRcodeDataForGroup,
} = require("../Services/chatServices");
const { generateUniqueID } = require("../untils/informationUntils");
const { addNotificationForUser } = require("./notificationServices");
const { UserModel } = require("../models/usersModel");
const { updateOneUser } = require("./userServices");

const users = {}; // Danh sách lưu trữ user đang online
const getMoldMessage = (userId, type, content) => {
  const messageId = generateUniqueID();
  return {
    messageId,
    senderId: userId,
    content,
    imagesUrl: [],
    reply: "",
    type:
      type === "group_voice" || type === "group_video" ? "group" : "personal",
    typeCall: type,
  };
};
let io; // Lưu trữ đối tượng io
const sendNotificationCallToUser = (userId, eventName, data) => {
  if (!io) return;
  if (userId && users[userId]) {
    io.to(users[userId]).emit(eventName, data);
    console.log("Đã gửi đến: ", users[userId]);

    return true;
  }
  console.log(
    `🚫 Không thể gửi thông báo đến user ${userId}: User không online`
  );
  return false;
};
async function updateOnlineUser(userId, isOnline) {
  await updateOneUser(userId, "online", isOnline);
}
const sendToUser = (userId, userMessages) => {
  console.log("Đã thông báo: ", users[userId]);
  sendNotificationCallToUser(userId, "receive_message", userMessages);

  if (!userMessages.isNotification) {
    sendNotificationCallToUser(userId, "notification_message", {
      ...userMessages,
      typeNotifi: "message",
    });
  }
};
const sendForMe = (id, messageData) => {
  sendNotificationCallToUser(id, "receive_message", messageData);
};
const handleSendMessages = (data) => {
  if (!data.senderId) {
    return;
  }
  const messageId = generateUniqueID();
  const userMessages = { ...data, messageId };
  console.log(userMessages);

  if (userMessages.receiverId) {
    sendToUser(userMessages.receiverId, userMessages);
  } else if (userMessages.recipients && userMessages.recipients.length > 0) {
    const ids = userMessages.recipients.filter(
      (item) => item !== data.senderId
    );

    ids.forEach((item) => sendToUser(item, userMessages));
  }

  // Chỉ gọi nếu cần thiết
  sendMessageToGroupAndPersonal(userMessages);
};
function initializeSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: "*", // Cho phép tất cả các nguồn truy cập
    },
  });
  io.on("connection", (socket) => {
    socket.on("callRegister", (userId) => {
      users[userId] = socket.id;
      console.log("📌 User register call: ", users);
      updateOnlineUser(userId, true);
    });

    socket.on("sendCallInvitation", (callData) => {
      if (callData.type === "group_voice" || callData.type === "group_video") {
        if (
          callData.targetId.length === 0 ||
          !Array.isArray(callData.targetId)
        ) {
          console.log("🚫 Lỗi: Không có user nào để gửi cuộc gọi!");
          return;
        }
        callData.targetId?.forEach((element) => {
          sendNotificationCallToUser(element, "incomingCall", callData);
        });
      } else {
        if (!callData.targetId) {
          try {
            addNotificationForUser(
              null,
              callData.userId,
              callData.targetId,
              `${callData.userName}`,
              "calling",
              `missed_call`
            );
            console.log("Add notification call successfully !!");
          } catch (error) {
            console.log("send call error: ", error);
          }
          return;
        }
        sendNotificationCallToUser(callData.targetId, "incomingCall", callData);

        console.log(`📞 Đã gửi cuộc gọi đến user`);
      }
    });

    socket.on("callAccepted", (data) => {
      const result = sendNotificationCallToUser(
        data.userId,
        "feedbackAccepted",
        data
      );

      if (result) {
        console.log("✅ Đã phản hồi cuộc gọi: ", data.callID);
      }
    });
    socket.on("callRefused", (data) => {
      console.log(
        "❌ Từ chối cuộc gọi từ:",
        data.userId,
        "-> Socket ID:",
        users[data.userId]
      );

      console.log("✅ Đã từ chối cuộc gọi: ", data.callID);

      if (data.type !== "group_voice" && data.type !== "group_video") {
        sendNotificationCallToUser(data.userId, "feedbackRefused", data);
        sendNotificationCallToUser(data.userId, "receive_message", data);
        const messageData = getMoldMessage(
          data.targetId,
          data.type,
          data.content
        );
        sendMessageToGroupAndPersonal({
          ...messageData,
          receiverId: data.userId,
        });
      }
    });

    socket.on("cancelCall", (data) => {
      const { targetId, userId, type } = data;
      const messageData = getMoldMessage(userId, type, data.content);
      const sendToUser = (id) => {
        sendNotificationCallToUser(id, "feedbackCancelCall", data);
      };

      if (type === "group_voice" || type === "group_video") {
        console.log(targetId);

        if (!Array.isArray(targetId)) {
          return;
        }
        targetId?.forEach((item) => sendToUser(item));
        sendForMe(userId, messageData);
        sendMessageToGroupAndPersonal({
          ...messageData,
          recipients: targetId,
          groupId: data.groupId,
        });
      } else {
        sendToUser(targetId);
        sendForMe(userId, messageData);
        sendMessageToGroupAndPersonal({ ...messageData, receiverId: targetId });
      }
    });
    socket.on("call_end", (data) => {
      console.log("Call_end: ", data);
      if (
        data.typeCall === "personal_voice" ||
        data.typeCall === "personal_video"
      ) {
        sendNotificationCallToUser(data.senderId, "feedbackCancelCall", data);
      }
      handleSendMessages(data);
    });
    socket.on("send_message", async (data) => {
      console.log("Data: ", data);
      handleSendMessages(data);
    });

    socket.on("send_qrcode", async (data) => {
      const messageId = generateUniqueID();
      const userMessages = { ...data, messageId };
      if (userMessages.recipients && userMessages.recipients.length > 0) {
        const ids = userMessages.recipients.filter(
          (item) => item !== data.senderId
        );
        ids.forEach((item) => sendToUser(item, userMessages));
      }
      // sendForMe(userMessages.senderId, userMessages);
      sendQRcodeDataForGroup(userMessages);
    });
    socket.on("leave_group", (userId) => {
      sendNotificationCallToUser(userId, "out_group", userId);
    });
    socket.on("disconnect", () => {
      const userId = Object.keys(users).find((key) => users[key] === socket.id);
      if (userId) {
        delete users[userId];
        console.log(`🚫 User ${userId} đã ngắt kết nối`);
        updateOnlineUser(userId, false);
      }
    });
  });

  return io;
}
module.exports = {
  initializeSocket,
  sendNotificationCallToUser,
};
