const { EventModel } = require("../models/usersModel");
const { v4: uuidv4 } = require("uuid");

const handlePostEvent = async (req, res) => {
  const data = req.body;
  console.log(data);
  const newEvent = new EventModel({
    postID: uuidv4(),
    userID: data.authorId,
    content: data.content,
    likes: 0,
    comments: [],
  });
  await newEvent.save();
  return res.status(200).json({
    messages: "post event successfully !!",
    data: newEvent,
  });
};
module.exports = {
  handlePostEvent,
};
