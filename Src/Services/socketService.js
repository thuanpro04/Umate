const socketIO = require("socket.io");
const {
  sendMessageToGroupAndPersonal,
  sendQRcodeDataForGroup,
} = require("../Services/chatServices");
const { generateUniqueID } = require("../untils/informationUntils");
const { addNotificationForUser } = require("./notificationServices");

const users = {}; // Danh sách lưu trữ user đang online

module.exports = function initializeSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: "*", // Cho phép tất cả các nguồn truy cập
    },
  });
  io.on("connection", (socket) => {
    socket.on("callRegister", (userId) => {
      users[userId] = socket.id;
      console.log("📌 User register call: ", users);
    });

    socket.on("sendCallInvitation", (callData) => {
      let targetSocketId;
      if (callData.type === "group_voice" || callData.type === "group_video") {
        if (callData.targetId.length === 0) {
          console.log("🚫 Lỗi: Không có user nào để gửi cuộc gọi!");
          return;
        }
        callData.targetId.forEach((element) => {
          targetSocketId = users[element];
          targetSocketId &&
            io.to(targetSocketId).emit("incomingCall", callData);
          console.log("Đã gui den user: ", targetSocketId);
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
        targetSocketId = users[callData.targetId];
        if (targetSocketId) {
          io.to(targetSocketId).emit("incomingCall", callData);
          console.log(`📞 Đã gửi cuộc gọi đến user ${targetSocketId}`);
        }
      }
    });
    socket.on("callAccepted", (data) => {
      const targetSocketId = users[data.userId];
      if (targetSocketId) {
        io.to(targetSocketId).emit("feedbackAccepted", data);
        console.log("✅ Đã phản hồi cuộc gọi: ", data.callID);
      }
    });

    socket.on("callRefused", (data) => {
      const targetSocketId = users[data.userId];
      console.log(
        "❌ Từ chối cuộc gọi từ:",
        data.userId,
        "-> Socket ID:",
        targetSocketId
      );

      if (targetSocketId) {
        io.to(targetSocketId).emit("feedbackRefused", data);
        console.log("✅ Đã từ chối cuộc gọi: ", data.callID);
      }
    });

    socket.on("cancelCall", (data) => {
      const { targetId, userId, type } = data;
      const targetSocketId = users[targetId];
      const userSocketId = users[userId];

      console.log("🎯 Target Socket ID:", targetSocketId);
      console.log("📞 Cancel call for user:", userId);

      const messageId = generateUniqueID();
      const messageData = {
        messageId,
        senderId: userId,
        content: "Bạn đã hủy cuộc gọi",
        imagesUrl: [],
        receiverId: targetId,
        reply: "",
        typeCall: type,
      };

      // Gửi sự kiện feedbackCancelCall nếu target online
      if (targetSocketId) {
        io.to(targetSocketId).emit("feedbackCancelCall", data);
      }

      // Gửi tin nhắn hủy đến cả 2 người
      [targetSocketId, userSocketId].forEach((socketId) => {
        if (socketId) {
          io.to(socketId).emit("receive_message", messageData);
        }
      });

      // Lưu tin nhắn vào database
      sendMessageToGroupAndPersonal(messageData);
    });

    socket.on("send_message", async (data) => {
      const messageId = generateUniqueID();
      const userMessages = { ...data, messageId };
      const targetSocketId = users[userMessages.receiverId];
      console.log("userMessages", userMessages);
      console.log("🎯 targetSocketId: ", targetSocketId, users);
      if (targetSocketId) {
        io.to(targetSocketId).emit("receive_message", data);
        console.log("receive_message id: ", targetSocketId);
      }
      sendMessageToGroupAndPersonal(userMessages);
    });
    socket.on("send_qrcode", async (data) => {
      const messageId = generateUniqueID();
      const userMessages = { ...data, messageId };
      sendQRcodeDataForGroup(userMessages);
    });

    socket.on("disconnect", () => {
      const userId = Object.keys(users).find((key) => users[key] === socket.id);
      if (userId) {
        delete users[userId];
        console.log(`🚫 User ${userId} đã ngắt kết nối`);
      }
    });
  });

  return io;
};
