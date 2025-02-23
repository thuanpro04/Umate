const { handleNewGroupUser ,handleActionAgreeOnGroup} = require("../Services/groupServices");

const handleAddGroupUser = (req, res) => {
  handleNewGroupUser(req,res);
  res.send("hello");
};
const actionAgreeOnGroup=(req,res) =>{
  handleActionAgreeOnGroup(req,res)
}
module.exports = {
  handleAddGroupUser,actionAgreeOnGroup
};
