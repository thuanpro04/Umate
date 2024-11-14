const { v4: uuidv4 } = require("uuid");
const { getUsersByIds, transformUserData } = require("./userServices");
const {
  ConversationModel,
  GroupConversationModel,
} = require("../models/usersModel");
const handleReceiveMessageUsers = async (req, res) => {
  const { senderID, receiverID } = req.query;
  const setting = { limit: 20, page: 1 };
  try {
    const dataMessages = await ConversationModel.findOne({
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
    const conversation = await ConversationModel.findOne({
      participants: { $all: [data.senderID, data.receiverID] },
    });

    if (!conversation) {
      const newConversation = new ConversationModel({
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

  try {
    // Lấy tất cả các cuộc trò chuyện cá nhân của người dùng hiện tại
    const personalConversations = await ConversationModel.find({
      participants: { $in: [currentUserID] },
    })
      .sort({ lastMessageTimestamp: -1 })
      .exec();

    // Lấy tất cả các cuộc trò chuyện nhóm mà người dùng hiện tại tham gia
    const groupConversations = await GroupConversationModel.find({
      "invitedUsers.userID": currentUserID,
    }).sort({ lastMessageTimestamp: -1 });

    // Kiểm tra nếu cả hai loại cuộc trò chuyện đều rỗng
    if (!personalConversations.length && !groupConversations.length) {
      return res.status(404).json({
        message: "No conversations found!",
      });
    }

    // Lấy danh sách ID của các user từ cuộc trò chuyện cá nhân
    const usersID = personalConversations.map((conv) =>
      conv.participants.find((userID) => userID !== currentUserID)
    );

    const usersInfo = await getUsersByIds(usersID); // Hàm này lấy thông tin nhiều user
    const formatData = transformUserData(usersInfo);

    // Chuẩn bị dữ liệu cho các cuộc trò chuyện cá nhân
    const personalConversationsData = personalConversations.map((conv) => {
      const otherUserID = conv.participants.find(
        (userID) => userID !== currentUserID
      );
      const user = formatData.find((user) => user.userID === otherUserID);
      return {
        type: "personal",
        ...user,
        lastMessage: conv.lastMessage || "",
        lastMessageTimestamp: conv.lastMessageTimestamp,
      };
    });

    // Chuẩn bị dữ liệu cho các cuộc trò chuyện nhóm
    const groupConversationsData = groupConversations.map((group) => ({
      type: "group",
      groupName: group.groupName,
      groupID: group.groupID,
      avatar: group.avatar,
      lastMessage: group.lastMessage || "",
      lastMessageTimestamp: group.lastMessageTimestamp,
      invitedUsers: group.invitedUsers,
      leader: group.leader,
      deputyLeader: group.deputyLeader,
      lastMessage: group.lastMessage,
      messages: group.messages,
      type:group.type
    }));

    // Kết hợp và sắp xếp tất cả các cuộc trò chuyện
    const allConversations = [
      ...personalConversationsData,
      ...groupConversationsData,
    ];
    console.log(groupConversationsData);

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
  handleSaveMessagesUser,
  handleGetAllConversationUsers,
};
