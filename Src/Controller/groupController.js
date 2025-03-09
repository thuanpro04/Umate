const {
  handleNewGroupUser,
  handleActionAgreeOnGroup,
  handleOutGroup,
  handleActionPosition
} = require("../Services/groupServices");


const handleAddGroupUser = (req, res) => {
  handleNewGroupUser(req, res);
  res.send("hello");
};
const actionAgreeOnGroup = (req, res) => {
  handleActionAgreeOnGroup(req, res);
};
const actionOutGroup = (req, res) => {
  handleOutGroup(req, res);
};
const actionPosition = async (req, res) => {
  handleActionPosition(req, res);
};
module.exports = {
  handleAddGroupUser,
  actionAgreeOnGroup,
  actionOutGroup,
  actionPosition,
};
