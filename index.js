const express = require("express");
const appRouters = require("./Src/Routers/routers");
const cors = require("cors");
const connectMongoose = require("./Src/config/connectDB");
require("dotenv").config();
const app = express();
app.use(cors());
const port = process.env.PORT || 3001; // Cung cấp cổng mặc định nếu không có biến môi trường
connectMongoose();
app.use(express.json());
app.use("/auth", appRouters);
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is running on port ${port}`);
});
