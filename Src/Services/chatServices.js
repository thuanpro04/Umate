const { MessageModel, UserModel } = require("../models/usersModel");
const { v4: uuidv4 } = require("uuid");
const {
  getUsersByIds,
  transformUserData,
  handleSearchByName,
} = require("./userServices");

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
const getLastMessages = (data) => {
  if (data.content && data.content.trim() !== "") {
    return data.content;
  } else if (data.imagesUrl && data.imagesUrl.length > 0) {
    return "Image";
  }
  return "";
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
        lastMessage: getLastMessages(data),
        updatedAt: new Date(),
        lastMessageTimestamp: data.timestamp || new Date(),
      });
      await newConversation.save();
    } else {
      conversation.messages.push(data);
      (conversation.lastMessageTimestamp = data.timestamp || new Date()),
        (conversation.lastMessage = data.content ?? data.imagesUrl);
      await conversation.save();
      console.log("Message added to existing conversation");
    }
    console.log("Message saved successfully!");
  } catch (error) {
    console.log(error);
  }
};
const handleGetAllConversationUsers = async (req, res) => {
  const { currentUserID } = req.query;
  const existingConversation = await MessageModel.find({
    participants: { $in: [currentUserID] },
  })
    .sort({ lastMessageTimestamp: -1 })
    .exec();
  if (!existingConversation) {
    return res.status(401).json({
      message: "Chats not found !!",
    });
  }

  const usersID = existingConversation.map((conv) =>
    conv.participants.find((userID) => userID !== currentUserID)
  );
  const usersInfo = await getUsersByIds(usersID);

  const formatData = transformUserData(usersInfo);

  const data = {
    usersInfo: existingConversation.map((conv, index) => {
      const otherUserID = conv.participants.find(
        (userID) => userID !== currentUserID
      );
      const user = formatData.find((user) => user.userID === otherUserID);
      return {
        ...user,
        lastMessage: conv.lastMessage || "", // Thêm lastMessage vào mỗi user
      };
    }),
  };

  console.log(data);

  return res.status(200).json({
    message: "Get all conversation successlly !!",
    data,
  });
};
const handleSearchConversations = async (req, res) => {
  const { currentUserID, keyWord } = req.query;
  try {
    const data = await handleSearchByName(keyWord, currentUserID);
    if (keyWord === "") {
      const userSuggests = data.slice(0, 3);
      return res.status(200).json({
        message: "Conversation not found !!!",
        data: userSuggests,
      });
    }
    return res.status(200).json({
      message: "Search conversations successfully !!!",
      data,
    });
  } catch (error) {
    console.log("handleSearchConversation", error);
  }
};
module.exports = {
  handleReceiveMessageUsers,
  handleSaveMessagesUser,
  handleGetAllConversationUsers,
  handleSearchConversations,
};
