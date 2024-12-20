const { v4: uuidv4 } = require("uuid");
const { getUsersByIds, transformUserData } = require("./userServices");
const {
  ConversationModel,
  GroupConversationModel,
} = require("../models/usersModel");
const { generateUniqueID } = require("../untils/infomationUntils");
const handleReceiveMessageUsers = async (req, res) => {
  const {
    senderID,
    receiverID,
    recipients,
    groupID,
    page,
    limit = 20,
  } = req.body;
  try {
    let dataMessages;

    if (receiverID && receiverID !== "undefined") {
      // Lấy tin nhắn trong cuộc trò chuyện cá nhân
      dataMessages = await ConversationModel.aggregate([
        {
          $match: {
            participants: { $all: [senderID, receiverID] },
          },
        },
        { $unwind: "$messages" }, // Tách mảng messages thành từng document
        { $sort: { "messages.timestamp": -1 } }, // Sắp xếp theo thời gian giảm dần
        { $skip: (page - 1) * limit }, // Bỏ qua các tin nhắn trước đó
        { $limit: parseInt(limit * page) }, // Giới hạn số lượng tin nhắn
        { $group: { _id: "$_id", messages: { $push: "$messages" } } }, // Gom lại mảng messages
      ]);
    } else if (groupID) {
      // Lấy tin nhắn trong nhóm
      dataMessages = await GroupConversationModel.aggregate([
        {
          $match: { groupID },
        },
        { $unwind: "$messages" },
        { $sort: { "messages.timestamp": -1 } },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) },
        { $group: { _id: "$_id", messages: { $push: "$messages" } } },
      ]);
    }

    // Nếu có dữ liệu tin nhắn
    if (dataMessages.length > 0) {
      const sortedMessages = dataMessages[0].messages.reverse(); // Đảo ngược lại để tăng dần thời gian
      return res.status(200).json({
        message: "ReceiveMessageUsers successfully!",
        data: {
          messagesAll: sortedMessages,
        },
        totalMessages: sortedMessages.length,
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
const sendMessageToGroupAndPersonal = async (data) => {
  console.log("dataMessage", data);

  try {
    if (!data.groupID) {
      if (!data.senderID || !data.receiverID) {
        console.error("Sender or receiver ID is missing");
        return;
      }
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
        console.log("New conversation created");
      } else {
        conversation.messages.push(data);
        (conversation.lastMessageTimestamp = data.timestamp || new Date()),
          (conversation.lastMessage = data.content ?? data.imagesUrl);
        await conversation.save();
        console.log("Message added to existing conversation");
      }
    } else {
      if (!data.groupID) {
        console.error("Group ID is missing");
        return;
      }
      const groupConversations = await GroupConversationModel.findOne({
        groupID: data.groupID,
      });
      if (!groupConversations) {
        return res.status(404).json({ messages: "Group not found" });
      }
      const recipients = groupConversations.invitedUsers.map(
        (item) => item.userID
      );
      const newMessages = {
        messageID: generateUniqueID(),
        senderID: data.senderID,
        content: data.content,
        imagesUrl: data.imagesUrl,
        recipients,
        timestamp: new Date(),
      };
      try {
        groupConversations.messages.push(newMessages);
        groupConversations.lastMessage = getLastMessages(data);
        groupConversations.lastMessageTimestamp = new Date();
        await groupConversations.save();
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
};
