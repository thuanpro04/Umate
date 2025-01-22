const {
  handlePostEvent,
  handleGetEvent,
  handleActionHeartForEvent,
} = require("../Services/eventServices");

const postEventUser = async (req, res) => {
  handlePostEvent(req, res);
};
const getNewEvent = (req, res) => {
  handleGetEvent(req, res);
 
};
const ActionHeartForEvent=(req,res)=>{
  handleActionHeartForEvent(req,res)
}
module.exports = {
  postEventUser,
  getNewEvent,
  ActionHeartForEvent
};
