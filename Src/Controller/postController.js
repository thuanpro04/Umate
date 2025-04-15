const {
  handleActionMyPostEvent,
  handleActionGetEventForUser,
  handleActionLikePostForUser,
  handleActionOpenLink,
  handleActionGetMyPost,
  handleActionRemovePost,
  handleActionRemovePostShare,
  handleActionHidePost,
  handleActionHideSharePostInPersonal,
  handleActionUpdatePrivacy,
  handleActionCreateComment,
  hanldeActionGetComments,
  handleAddReplyComment,
} = require("../Services/postServices");

const actionMyPostEvent = (req, res) => {
  handleActionMyPostEvent(req, res);
};
const actionGetEventForUser = async (req, res) => {
  handleActionGetEventForUser(req, res);
};
const actionLikePostForUser = (req, res) => {
  handleActionLikePostForUser(req, res);
};
const actionOpenLink = (req, res) => {
  handleActionOpenLink(req, res);
};
const actionGetMyPost = (req, res) => {
  handleActionGetMyPost(req, res);
};
const actionRemovePost = (req, res) => {
  handleActionRemovePost(req, res);
};
const actionRemovePostShare = (req, res) => {
  handleActionRemovePostShare(req, res);
};
const actionHidePost = (req, res) => {
  const { key } = req.body;
  if (key === "personal") {
    handleActionHideSharePostInPersonal(req, res);
  } else {
    handleActionHidePost(req, res);
  }
};
const actionUpdatePrivacy = (req, res) => {
  handleActionUpdatePrivacy(req, res);
};
const actionCreateComment = (req, res) => {
  handleActionCreateComment(req, res);
};
const actionGetComments = (req, res) => {
  hanldeActionGetComments(req, res);
};
const actionAddReplyComment = (req, res) => {
  handleAddReplyComment(req, res);
};
module.exports = {
  actionMyPostEvent,
  actionGetEventForUser,
  actionLikePostForUser,
  actionOpenLink,
  actionGetMyPost,
  actionRemovePost,
  actionRemovePostShare,
  actionHidePost,
  actionUpdatePrivacy,
  actionCreateComment,
  actionGetComments,
  actionAddReplyComment,
};
