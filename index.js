const express = require("express");
const appRouters = require("./Routers/routers");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
const port = process.env.PORT;
app.use(express.json());
app.use("/auth", appRouters);

app.listen(port, (error) => {
  if (error) {
    console.log(error);
  }
  console.log(`Server is running on port ${port}`);
});
