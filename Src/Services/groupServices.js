const { GroupConversationModel } = require("../models/usersModel");
const { generateUniqueID } = require("../untils/informationUntils");

const handleNewGroupUser = async (req, res) => {
  const groupInfo = { groupId: generateUniqueID(), ...req.body };
  // console.log("group", groupInfo);
  const invitedUsers = groupInfo.invitedUsers.flatMap((user) => user.userId);
  console.log("invitedUsers", invitedUsers);

  try {
    const messageId = generateUniqueID();
    const newGroup = new GroupConversationModel({
      ...groupInfo,
      invitedUsers,
      message: [{ messageId }],
      lastMessage: "",
      lastMessageTimestamp: null,
      groupId: generateUniqueID(),
    });
    await newGroup.save();
    if (!res.headersSent) {
      return res.status(200).json({
        message: "New group created successfully!",
      });
    }
  } catch (error) {
    console.error("handleNewGroupUser", error);
    // Đảm bảo chỉ gửi phản hồi một lần
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Error creating group",
        error: error.message,
      });
    }
  }
};

module.exports = {
  handleNewGroupUser,
};
