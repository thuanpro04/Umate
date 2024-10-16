const { MessageModel } = require("../models/usersModel");
const { v4: uuidv4 } = require("uuid");

const handleReceiveMessageUsers = async (req, res) => {
  const { senderID, receiverID } = req.query;
  const setting = { limit: 20, page: 1 };
  try {
    const dataMessages = await MessageModel.findOne({
      participants: { $all: [senderID, receiverID] },
    })
      .populate({
        path: "messages",
        options: {
          sort: { timestamp: -1 }, // Sắp xếp theo tin nhắn mới nhất
          limit: setting.limit, // Giới hạn 20 tin nhắn
          skip: (setting.page - 1) * setting.limit, // Bỏ qua các tin nhắn cũ
        },
      })
      .lean();

    if (dataMessages) {
      const sortedMessages = dataMessages.messages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      console.log("sortedMessages", sortedMessages);
      return res.status(200).json({
        message: "ReceiveMessageUsers successfully!",
        data: sortedMessages,
        totalMessages: dataMessages.messages.length,
      });
    } else {
      return res.status(200).json({
        messages: "No messages found.",
      });
    }
  } catch (error) {
    res.status(500).send("Error retrieving messages: " + error);
  }
};
const handleSaveMessagesUser = async (data) => {
  try {
    const conversation = await MessageModel.findOne({
      participants: { $all: [data.senderID, data.receiverID] },
    });

    if (!conversation) {
      const newConversation = new MessageModel({
        conversationID: uuidv4(),
        participants: [data.senderID, data.receiverID],
        messages: [data],
        lastMessage:
          data.content && data.content.trim() !== ""
            ? data.content
            : data.imagesUrl.length > 0
            ? "Image"
            : "",
      });
      await newConversation.save();
    } else {
      conversation.messages.push(data);
      conversation.lastMessage = data.content ?? data.imagesUrl;
      await conversation.save();
      console.log("Message added to existing conversation");
    }
    // Gửi tin nhắn tới tất cả các client đang kết nối

    console.log("Message saved successfully!");
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  handleReceiveMessageUsers,
  handleSaveMessagesUser,
};
