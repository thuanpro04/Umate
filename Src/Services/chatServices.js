const { v4: uuidv4 } = require("uuid");
const {
  getUsersByIds,
  transformUserData,
  findUserById,
} = require("./userServices");
const { generateUniqueID } = require("../untils/informationUntils");
const { addNotificationForUser } = require("./notificationServices");
const { GroupConversationModel } = require("../models/groupConversationModel");
const { ConversationModel } = require("../models/personalConversationModel");
const CryptoJS = require("crypto-js");
const handleReceiveMessageUsers = async (req, res) => {
  const { id, page, limit = 20, key } = req.query;
  try {
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
  } else if (data.imagesUrl.length > 0) {
    return "Image";
  }
  return "";
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
    participants: { $all: [senderId, receiverId], $size: 2 },
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
  return newConversation;
};

const sendMessageToGroupAndPersonal = async (data) => {
  console.log("dataMessage", data);
  try {
    if (!data.groupId) {
      if (!data.senderId) {
        console.error("Sender ID is missing");
        return;
      }

      let conversation = await getConversationInfo(
        data.senderId,
        data.receiverId
      );
      if (!conversation) {
        conversation = await setConversation(data);
      } else {
        conversation.message.push(data);
        conversation.lastMessageTimestamp = data.timestamp || new Date();
        conversation.lastMessage = data.content ?? data.imagesUrl;
        await conversation.save(),
          console.log("Message added to existing conversation");
      }

      const mess = conversation.message[conversation.message.length - 1];
      if (
        mess.status === "sent" &&
        Array.isArray(conversation.notification) &&
        !conversation.notification.includes(mess.receiverId)
      ) {
        // thông báo cho người nhận
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

      try {
        groupConversations.message.push(data);
        groupConversations.lastMessage = getLastMessages(data);
        groupConversations.lastMessageTimestamp = new Date();
        await groupConversations.save();
        console.log("Message saved successfully!");
        const mess =
          groupConversations.message[groupConversations.message.length - 1];
        if (
          mess.status === "sent" &&
          !groupConversations.notification.includes(mess.receiverId)
        ) {
          // thông báo cho người nhận
        }
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
const sanitizeString = (str) => {
  if (typeof str !== "string" || str.trim() === "") return "";
  try {
    const bytes = CryptoJS.AES.decrypt(str, process.env.SECRETKEY);
    const content = bytes.toString(CryptoJS.enc.Utf8);
    return content.normalize("NFC");
  } catch (error) {
    console.error("Error in sanitizeString:", error);
    return "";
  }
};
const handleGetAllConversationUsers = async (req, res) => {
  const { currentUserId, page } = req.query;
  const limit = 10; // Số cuộc trò chuyện mỗi trang
  const skip = (page - 1) * limit;
  try {
    // Lấy tất cả các cuộc trò chuyện cá nhân của người dùng hiện tại
    const personalConversations = await ConversationModel.find({
      participants: { $in: [currentUserId] },
    })
      .sort({ lastMessageTimestamp: -1 })
      .exec();
    const groupConversations = await GroupConversationModel.find({
      invitedUsers: { $in: [currentUserId] },
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
        lastMessage: sanitizeString(conv.lastMessage) || "",
        lastMessageTimestamp: conv.lastMessageTimestamp,
        conversationId: conv.conversationId,
        statusLastMessage:
          conv.message[conv.message.length - 1].receiverId === currentUserId &&
          conv.message[conv.message.length - 1].status === "sent",
        notification: conv.notification,
        nickNames: conv.nicknames,
        theme: conv.theme,
        pinnedBy: conv.pinnedBy,
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
      lastMessage: sanitizeString(group.lastMessage) || "",
      lastMessageTimestamp: group.lastMessageTimestamp,
      invitedUsers: group.invitedUsers,
      leader: group.leader,
      deputyLeader: group.deputyLeader,
      messages: group.messages,
      type: group.type,
      notification: group.notification,
      statusLastMessage:
        group.message[group.message.length - 1].senderId !== currentUserId &&
        group.message[group.message.length - 1].status === "sent",
      nickNames: group.nicknames,
      theme: group.theme,
      pinnedBy: group.pinnedBy,
    }));
    // Kết hợp và sắp xếp tất cả các cuộc trò chuyện
    const allConversations = [
      ...personalConversationsData,
      ...groupConversationsData,
    ];
    allConversations.sort(
      (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp
    );
    const paginatedConversations = allConversations.slice(skip, skip + limit);
    return res.status(200).json({
      message: "Get all conversations successfully!",
      data: {
        allConversations: paginatedConversations,
        totalPage: Math.ceil(allConversations.length / limit),
      },
    });
  } catch (error) {
    console.error("handleGetAllConversationUsers Error:", error);
    return res.status(500).json({
      message: "Error retrieving conversations",
      error: error.message,
    });
  }
};

const handleUpdateStatusMessage = async (req, res) => {
  const { userId, id, key } = req.body;
  try {
    let isUpdate;
    if (key === "personal") {
      const conversation = await ConversationModel.findOne({
        conversationId: id,
      });
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      conversation.message.forEach((e) => {
        if (e.receiverId === userId && e.status !== "read") {
          e.status = "read";
          if (!e.readBy.includes(userId)) {
            e.readBy.push(userId);
          }
          isUpdate = true;
        }
      });
      if (isUpdate) {
        await conversation.save();
      }
    } else {
      const groupConversation = await GroupConversationModel.findOne({
        groupId: id,
      });
      groupConversation.message.forEach((e) => {
        if (e.senderId !== userId && e.status !== "read") {
          e.status = "read";
          if (!e.readBy.includes(userId)) {
            e.readBy.push(userId);
          }
          isUpdate = true;
        }
      });
      if (isUpdate) {
        await groupConversation.save();
      }
      console.log(groupConversation.message);
    }
    res.status(200).json({
      message: "update status message successfully!!",
      data: [],
    });
  } catch (error) {
    console.log("update status message fail: ", error);
  }
};
const actionDeleteConversationForPersonal = async (ids) => {
  return await ConversationModel.deleteMany({ conversationId: { $in: ids } });
};
const actionDeleteConversationForGroup = async (ids) => {
  return GroupConversationModel.deleteMany({ groupId: { $in: ids } });
};

const handleDeleteConversation = async (req, res) => {
  const arrConver = req.body;
  const idPersons = arrConver["personal"] || [];
  const idGroups = arrConver["group"] || [];
  if (idGroups.length === 0 && idPersons.length === 0) {
    return res
      .status(400)
      .json({ message: "Không có cuộc trò chuyện nào để xóa!" });
  }
  try {
    const [deletePersonal, deleteGroup] = await Promise.all([
      actionDeleteConversationForPersonal(idPersons),
      actionDeleteConversationForGroup(idGroups),
    ]);
    if (deletePersonal.deletedCount > 0 || deleteGroup.deletedCount > 0) {
      res.status(200).json({
        message: "Delete conversation successfully!! ",
        data: {
          personal: idPersons,
          group: idGroups,
        },
      });
    } else {
      return res
        .status(404)
        .json({ message: "Không tìm thấy cuộc trò chuyện nào để xóa!" });
    }
  } catch (error) {
    console.log("Delete conversation error: ", error);
  }
};
const getConversation = async (id) => {
  return await ConversationModel.findOne({ conversationId: id });
};
const getGroupConversation = async (id) => {
  return await GroupConversationModel.findOne({ groupId: id });
};

const handleGetImageForConversation = async (req, res) => {
  const { id, type } = req.query;
  try {
    const conver = await (type === "personal"
      ? getConversation(id)
      : getGroupConversation(id));
    if (!conver || !Array.isArray(conver.message)) {
      return res
        .status(404)
        .json({ error: "Conversation not found or has no messages" });
    }
    const images = conver.message.flatMap((item) =>
      Array.isArray(item.imagesUrl) ? item.imagesUrl.filter(Boolean) : []
    );
    res.status(200).json({
      message: "Get images successfully !!!",
      data: images,
    });
  } catch (error) {
    console.log("Get image fail: ", error);
  }
};
const handleGetLink = async (req, res) => {
  const { id, type } = req.query;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  try {
    const conver = await (type === "personal"
      ? getConversation(id)
      : getGroupConversation(id));
    if (!conver) {
      return res.status(401).json({
        message: "Conversation not found ?",
      });
    }
    console.log(conver);
    const result = conver.message
      .map((item) => {
        const urls = item?.content?.match(urlRegex);
        if (!urls) return null; // Không có link thì bỏ qua

        // Lấy phần trước link làm title
        const title = item.title;

        return urls.map((url) => ({ title, url, _id: item._id }));
      })
      .filter((match) => match !== null) // Loại bỏ null
      .flat(); // Gộp tất cả thành một mảng duy nhất
    console.log("Get link successfully !!!", result);

    res.status(200).json({
      message: "Get link successfully !!!",
      data: result,
    });
  } catch (error) {
    console.log("Get link error: ", error);
  }
};

const handleUpdateNickName = async (req, res) => {
  const { userId, value, id, key } = req.body;
  console.log(userId, value, id, key);
  let data;
  try {
    if (key === "personal") {
      const conversation = await ConversationModel.findOneAndUpdate(
        { conversationId: id },
        { $set: { [`nicknames.${userId}`]: value } }, // Cập nhật key trong Map
        { new: true }
      );

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      data = conversation.nicknames;
    } else {
      const group = await GroupConversationModel.findOneAndUpdate(
        { groupId: id },
        { $set: { [`nicknames.${userId}`]: value } },
        { new: true }
      );
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      data = group.nicknames;
    }
    res.json({
      message: "Nickname updated successfully",
      data,
    });
  } catch (error) {
    console.error("Error updating nickname:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const handleUpdateThemeConversation = async (req, res) => {
  const { id, theme, key } = req.body;
  try {
    const conversation = await (key === "personal"
      ? getConversation(id)
      : getGroupConversation(id));
    if (!conversation) {
      return res.status(401).json({
        message: "Conversation not found ?",
      });
    }
    conversation.theme = theme;
    await conversation.save();
    return res.status(200).json({
      message: "update theme conversation successfully !!!",
      data: theme,
    });
  } catch (error) {
    console.log("update theme conver error: ", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const sendQRcodeDataForGroup = async (data) => {
  try {
    const group = await getGroupConversation(data.groupId);
    if (!group) {
      console.log("Conversation not found ?");
      return;
    }
    const messages = {
      messageId: data.messageId,
      senderId: data.senderId,
      content: data.content,
      imagesUrl: [],
      timestamp: new Date(),
      QRCode: {
        qrdata: data.QRCode.qrdata,
        attended: [],
      },
      lastMessage: "hình ảnh",
    };
    group.message.push(messages);
    await group.save();
    console.log(
      "Save data qrcode successfully !!",
      data.QRCode,
      messages.QRCode
    );
  } catch (error) {
    console.log("Save data Qr code error: ", error);
  }
};

const handleActionGhimConversation = async (req, res) => {
  const { id, userId, key } = req.body;
  console.log(id, userId, key);
  try {
    const conv = await (key === "personal"
      ? getConversation(id)
      : getGroupConversation(id));
    if (!conv) {
      return res.status(401).json({
        message: "Conv not found !1",
      });
    }
    const existingUser = conv.pinnedBy.includes(userId);
    if (existingUser) {
      conv.pinnedBy = conv.pinnedBy.filter((item) => item !== userId);
    } else {
      conv.pinnedBy.push(userId);
    }

    await conv.save();

    return res
      .status(200)
      .json({ message: "Handle ghim successfully", data: conv.pinnedBy });
  } catch (error) {
    console.log("Ghim fail: ", error);
  }
};
module.exports = {
  handleReceiveMessageUsers,
  sendMessageToGroupAndPersonal,
  handleGetAllConversationUsers,
  handleCheckConversation,
  handleUpdateStatusMessage,
  handleDeleteConversation,
  handleGetImageForConversation,
  handleGetLink,
  getConversation,
  handleUpdateNickName,
  handleUpdateThemeConversation,
  sendQRcodeDataForGroup,
  handleActionGhimConversation,
  getGroupConversation,
};
