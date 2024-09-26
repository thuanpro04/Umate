const { mongoose } = require("mongoose");
require("dotenv").config();
const dbUrl = `mongodb+srv://phanminhthuan240304:66I6RYG2RDIAAd4C@cluster0.jignw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const connectMongoose = async () => {
  try {
    const connection = await mongoose.connect(dbUrl);
    console.log("Connect to mongo db successfully.");
  } catch (error) {
    console.log("Connect mongoose fail", error);
  }
};
module.exports= connectMongoose;