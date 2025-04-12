const {
  handleActionMyPostEvent,
  handleActionGetEventForUser,
  handleActionLikePostForUser,handleActionOpenLink
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
const actionOpenLink=(req,res) =>{
  handleActionOpenLink(req,res)
}
module.exports = {
  actionMyPostEvent,
  actionGetEventForUser,
  actionLikePostForUser,actionOpenLink
};
