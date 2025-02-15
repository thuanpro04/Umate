const express = require("express");
const http = require("http"); // Sử dụng http module để tạo server
const socketIO = require("socket.io"); // Gọi Socket.IO
const appRouters = require("./Src/Routers/authRouters");
const cors = require("cors");
require("dotenv").config();
const connectMongoose = require("./Src/config/connectDB");
const usersRouter = require("./Src/Routers/usersRouters");
const chatRouter = require("./Src/Routers/ChatRouters");
const searchRouter = require("./Src/Routers/searchRouters");
const friendRouter = require("./Src/Routers/friendRouters");
const {
  sendMessageToGroupAndPersonal,
} = require("./Src/Services/chatServices");
const eventRouter = require("./Src/Routers/eventRouters");
const groupRouter = require("./Src/Routers/groupRouters");
const { generateUniqueID } = require("./Src/untils/informationUntils");
const app = express();
app.use(cors());
const port = process.env.PORT || 3001; // Cung cấp cổng mặc định nếu không có biến môi trường
connectMongoose();
// Sử dụng middleware để xử lý JSON
app.use(express.json());
app.use("/auth", appRouters);
app.use("/users", usersRouter);
app.use("/chats", chatRouter);
app.use("/api", searchRouter);
app.use("/api-friends", friendRouter);
app.use("/events-api", eventRouter);
app.use("/group-api", groupRouter);
// Tạo HTTP server và tích hợp với Socket.IO
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", // Cho phép tất cả các nguồn truy cập
  },
});

io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);
  socket.on("send_message", async (data) => {
    const messageId = generateUniqueID();
    const userMessages = {
      ...data,
      messageId,
    };
    console.log("userMessages", userMessages);

    console.log("Received message: ", userMessages);
    sendMessageToGroupAndPersonal(userMessages);
    io.emit("receive_message", userMessages);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
