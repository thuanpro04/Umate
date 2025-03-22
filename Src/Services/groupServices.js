const { notificationModel } = require("../models/notificationModel");
const { GroupConversationModel } = require("../models/usersModel");
const { generateUniqueID } = require("../untils/informationUntils");
const { deletedNotification } = require("./notificationServices");

const handleNewGroupUser = async (req, res) => {
  const groupInfo = req.body;
  // console.log("group", groupInfo);
  const invitedUsers = groupInfo.invitedUsers.flatMap((user) => user.userId);
  // console.log("invitedUsers", invitedUsers);
  const id = generateUniqueID();
  try {
    const messageId = generateUniqueID();
    const newGroup = new GroupConversationModel({
      ...groupInfo,
      invitedUsers,
      message: [{ messageId }],
      lastMessage: "",
      lastMessageTimestamp: null,
      groupId: id,
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
const handleActionAgreeOnGroup = async (req, res) => {
  const { userId, id, groupId } = req.body;
  console.log(userId, id, groupId);

  try {
    await GroupConversationModel.updateOne(
      { groupId },
      { $addToSet: { invitedUsers: userId } }
    );
    const result = await notificationModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông báo để xóa." });
    }
    res.status(200).json({ message: "Xóa thông báo thành công!", data: id });
  } catch (error) {
    console.log("Action agree on group error: ", error);
  }
};
const getGroupConversation = async (id) => {
  return await GroupConversationModel.findOne({ groupId: id });
};
const handleOutGroup = async (req, res) => {
  const { id, userId } = req.query;
  const group = await getGroupConversation(id);
  if (!group) {
    return res.status(401).json({
      message: "Group not found !",
    });
  }
  try {
    if (group.invitedUsers.length === 1) {
      await GroupConversationModel.findOneAndDelete({ groupId: id });
      return res.status(200).json({ message: "Group deleted successfully!" });
    }
    group.invitedUsers = group.invitedUsers.filter((item) => item !== userId);
    let nextCandidate;
    if (group.leader?.userId === userId) {
      nextCandidate = group.invitedUsers.find(
        (user) => user !== group.deputyLeader.userId
      );
      group.leader.userId = group.invitedUsers[0] || null; // Chuyển leader cho người đầu tiên còn lại
    }

    // Xử lý deputyLeader nếu người rời nhóm là deputyLeader
    if (group.deputyLeader?.userId === userId) {
      nextCandidate = group.invitedUsers.find(
        (user) => user !== group.leader.userId
      );
      group.deputyLeader.userId = nextCandidate || null;
    }
    await group.save();

    return res.status(200).json({
      message: "User removed from group successfully!",
      data: group.invitedUsers,
    });
  } catch (error) {
    console.error("Error removing user from group:", error);
    return res.status(500).json({
      message: "Error removing user from group",
      error: error.message,
    });
  }
};
const handleActionPosition = async (req, res) => {
  const { id, userId, position } = req.body;
  console.log(position);

  try {
    if (!position) {
      return res.status(400).json({ message: "Position is required!" });
    }
    const group = await getGroupConversation(id);
    if (!group) {
      return res.status(401).json({
        message: "Group not found !",
      });
    }
    if (position === "leader") {
      group.leader.userId = userId;
    } else if (position === "deputyLeader") {
      group.deputyLeader.userId = userId;
    }
    await group.save();

    return res.status(200).json({
      message: `Successfully updated ${position}!`,
      data:
        position === "leader"
          ? group.leader
          : position === "deputyLeader"
          ? group.deputyLeader
          : undefined,
    });
  } catch (error) {
    console.error("Error changing position:", error);
    return res
      .status(500)
      .json({ message: "Error changing position", error: error.message });
  }
};
module.exports = {
  handleNewGroupUser,
  handleActionAgreeOnGroup,
  handleOutGroup,
  getGroupConversation,
  handleActionPosition,
};
