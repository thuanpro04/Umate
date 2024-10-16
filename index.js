const express = require("express");
const http = require("http"); // Sử dụng http module để tạo server
const socketIO = require("socket.io"); // Gọi Socket.IO
const appRouters = require("./Src/Routers/authRouters");
const cors = require("cors");
const connectMongoose = require("./Src/config/connectDB");
const usersRouter = require("./Src/Routers/usersRouters");
const chatRouter = require("./Src/Routers/ChatRouters");
const { handleSaveMessagesUser } = require("./Src/Services/chatServices");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const app = express();
app.use(cors());
const port = process.env.PORT || 3001; // Cung cấp cổng mặc định nếu không có biến môi trường
connectMongoose();
// Sử dụng middleware để xử lý JSON
app.use(express.json());
app.use("/auth", appRouters);
app.use("/users", usersRouter);
app.use("/chats", chatRouter);

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
    const messageID = uuidv4();
    const userMessages = {
      ...data,
      messageID,
    };
    console.log("userMessages",userMessages);
    
    console.log("Received message: ", userMessages);
    handleSaveMessagesUser(userMessages);
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
