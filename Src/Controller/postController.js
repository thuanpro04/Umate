const { handleActionMyPostEvent,handleActionGetEventForUser } = require("../Services/postServices");

const actionMyPostEvent = (req, res) => {
  handleActionMyPostEvent(req,res)
};
const actionGetEventForUser=async(req,res) =>{
  handleActionGetEventForUser(req,res)
}
module.exports = {
  actionMyPostEvent,actionGetEventForUser
};
