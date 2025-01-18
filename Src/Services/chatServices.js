const { v4: uuidv4 } = require("uuid");
const { getUsersByIds, transformUserData } = require("./userServices");
const {
  ConversationModel,
  GroupConversationModel,
  MessageModel,
} = require("../models/usersModel");
const { generateUniqueID } = require("../untils/infomationUntils");
const handleReceiveMessageUsers = async (req, res) => {
  const { id, page, limit = 20, key } = req.query;
  console.log(req.query);

  try {
    console.log("Page", page, "Limit", limit * page);

    let data, messages;

    if (id !== "undefined" && key === "personal") {
      const conversation = await ConversationModel.findOne({
        conversationId: id,
      });
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      // Lấy tin nhắn trong cuộc trò chuyện cá nhân
      messages = conversation.message
        .reverse()
        .slice((page - 1) * limit, page * limit);
      data = {
        messages,
        totalMessages: conversation.message.length,
        currentPage: page,
        totalPages: Math.ceil(conversation.message.length / limit),
      };
    } else if (id !== "undefined" && key === "group") {
      // Lấy tin nhắn trong nhóm
      const groupConversation = await GroupConversationModel.findOne({
        groupId: id,
      });
      messages = groupConversation.message
        .reverse()
        .slice((page - 1) * limit, page * limit);
      //0
      data = {
        messages,
        totalMessages: groupConversation.message.length,
        currentPage: page,
        totalPages: Math.ceil(groupConversation.message.length / limit),
      };
    }

    // Nếu có dữ liệu tin nhắn
    if (data) {
      return res.status(200).json({
        message: "ReceiveMessageUsers successfully!",
        data,
      });
    } else {
      return res.status(200).json({
        message: "No messages found.",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).send("Error retrieving messages: " + error.message);
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
const findMessageById = async (id) => {
  const mess = await MessageModel.findOne({ messageId: id });
  return mess;
};
const updateMessageById = async (id, data) => {
  try {
    const result = await MessageModel.updateOne({ messageId: id }, data);
    if (result.nModified === 0) {
      console.error("No message found with ID: ", id);
    }
  } catch (error) {
    console.error("Error updating message", error);
  }
};
const handleCheckConversation = async (req, res) => {
  const { senderId, receiverId } = req.body;
  const conv = await getConversationInfo(senderId, receiverId);

  if (conv) {
    res.status(200).json({
      messages: "check conversation successfully ",
      data: conv.conversationId ?? undefined,
    });
  } else {
    res.send("conversation not found !!!");
  }
};
const getConversationInfo = async (senderId, receiverId) => {
  const conversation = await ConversationModel.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  return conversation;
};
const setConversation = async (data) => {
  const newConversation = new ConversationModel({
    conversationId: uuidv4(),
    participants: [data.senderId, data.receiverId],
    message: [data],
    lastMessage: getLastMessages(data),
    updatedAt: new Date(),
    lastMessageTimestamp: data.timestamp || new Date(),
  });
  await newConversation.save();
  console.log("New conversation created");
};
const sendMessageToGroupAndPersonal = async (data) => {
  console.log("dataMessage", data);

  try {
    if (!data.groupId) {
      if (!data.senderId || !data.receiverId) {
        console.error("Sender or receiver ID is missing");
        return;
      }
      const conversation = await getConversationInfo(
        data.senderId,
        data.receiverId
      );

      if (!conversation) {
        await setConversation(data);
      } else {
        conversation.message.push(data);
        conversation.lastMessageTimestamp = data.timestamp | new Date();
        conversation.lastMessage = data.content ?? data.imagesUrl;
        await conversation.save(),
          // await Promise.all([

          //   updateMessageById(data.messageId, data),
          // ]);
          console.log("Message added to existing conversation");
      }
    } else {
      if (!data.groupId) {
        console.error("Group Id is missing");
        return;
      }
      const groupConversations = await GroupConversationModel.findOne({
        groupId: data.groupId,
      });
      if (!groupConversations) {
        return res.status(404).json({ messages: "Group not found" });
      }
      const recipients = groupConversations.invitedUsers.map(
        (item) => item.userId
      );
      const messages = {
        messageId: data.messageId,
        senderId: data.senderId,
        content: data.content,
        imagesUrl: data.imagesUrl,
        recipients,
        timestamp: new Date(),
      };
      try {
        groupConversations.message.push(data);
        groupConversations.lastMessage = getLastMessages(data);
        groupConversations.lastMessageTimestamp = new Date();
        await Promise.all([groupConversations.save(), newMessage.save]);
        console.log("Message saved successfully!");
      } catch (error) {
        console.error("Error saving groupConversations:", error);
        return res
          .status(500)
          .json({ message: "Failed to save group conversations" });
      }
    }
    console.log("Message saved successfully!");
  } catch (error) {
    console.log(error);
  }
};
const handleGetAllConversationUsers = async (req, res) => {
  const { currentUserId } = req.query;

  try {
    // Lấy tất cả các cuộc trò chuyện cá nhân của người dùng hiện tại
    const personalConversations = await ConversationModel.find({
      participants: { $in: [currentUserId] },
    })
      .sort({ lastMessageTimestamp: -1 })
      .exec();
    const groupConversations = await GroupConversationModel.find({
      "invitedUsers.userId": currentUserId,
    }).sort({ lastMessageTimestamp: -1 });
    // Kiểm tra nếu cả hai loại cuộc trò chuyện đều rỗng
    if (!personalConversations.length && !groupConversations.length) {
      return res.status(404).json({
        message: "No conversations found!",
        data: [],
      });
    }

    // Lấy danh sách ID của các user từ cuộc trò chuyện cá nhân
    const usersID = personalConversations.map((conv) =>
      conv.participants.find((userId) => userId !== currentUserId)
    );

    const usersInfo = await getUsersByIds(usersID); // Hàm này lấy thông tin nhiều user
    const formatData = transformUserData(usersInfo);

    // Chuẩn bị dữ liệu cho các cuộc trò chuyện cá nhân
    const personalConversationsData = personalConversations.map((conv) => {
      const otherUserId = conv.participants.find(
        (userId) => userId !== currentUserId
      );
      const user = formatData.find((user) => user.userId === otherUserId);
      return {
        type: "personal",
        ...user,
        lastMessage: conv.lastMessage || "",
        lastMessageTimestamp: conv.lastMessageTimestamp,
        conversationId: conv.conversationId,
      };
    });
    // Lấy tất cả các cuộc trò chuyện nhóm mà người dùng hiện tại tham gia

    // Chuẩn bị dữ liệu cho các cuộc trò chuyện nhóm
    // console.log("groupConversations",groupConversations);

    const groupConversationsData = groupConversations.map((group) => ({
      type: "group",
      groupName: group.groupName,
      groupId: group.groupId,
      avatar: group.avatar,
      lastMessage: group.lastMessage || "",
      lastMessageTimestamp: group.lastMessageTimestamp,
      invitedUsers: group.invitedUsers,
      leader: group.leader,
      deputyLeader: group.deputyLeader,
      lastMessage: group.lastMessage,
      messages: group.messages,
      type: group.type,
    }));

    // Kết hợp và sắp xếp tất cả các cuộc trò chuyện
    const allConversations = [
      ...personalConversationsData,
      ...groupConversationsData,
    ];

    allConversations.sort(
      (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp
    );

    return res.status(200).json({
      message: "Get all conversations successfully!",
      data: allConversations,
    });
  } catch (error) {
    console.error("handleGetAllConversationUsers Error:", error);
    return res.status(500).json({
      message: "Error retrieving conversations",
      error: error.message,
    });
  }
};

module.exports = {
  handleReceiveMessageUsers,
  sendMessageToGroupAndPersonal,
  handleGetAllConversationUsers,
  handleCheckConversation,
};
