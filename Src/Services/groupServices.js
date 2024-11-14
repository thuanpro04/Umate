const { GroupConversationModel } = require("../models/usersModel");
const { generateUniqueID } = require("../untils/infomationUntils");

const handleNewGroupUser = async (req, res) => {
  const groupInfo = { groupID: generateUniqueID(), ...req.body };
  try {
    const newGroup = new GroupConversationModel({
      ...groupInfo,
      messages: [], 
      lastMessage: "", 
      lastMessageTimestamp: null,
      
    });
    await newGroup.save();
    return res.status(200).json({
      message: "New group created successfully!",
      data: newGroup,
    });
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
