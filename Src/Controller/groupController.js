const {
  handleNewGroupUser,
  handleActionAgreeOnGroup,
  handleOutGroup,
  handleActionPosition,
  handleUpdateAttendedGroup
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
const updateAttendedGroup = async (req, res) => {
  handleUpdateAttendedGroup(req, res);
};
module.exports = {
  handleAddGroupUser,
  actionAgreeOnGroup,
  actionOutGroup,
  actionPosition,
  updateAttendedGroup
};
