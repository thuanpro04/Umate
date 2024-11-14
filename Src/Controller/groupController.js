const { handleNewGroupUser } = require("../Services/groupServices");

const handleAddGroupUser = (req, res) => {
  handleNewGroupUser(req,res);
  res.send("hello");
};
module.exports = {
  handleAddGroupUser,
};
