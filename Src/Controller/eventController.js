const {
  handlePostEvent,
  handleGetEvent,
  handleActionHeartForEvent,
  handleShareEventMyApp,
  handleGetEventShared
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
const shareEventMyApp=(req,res) =>{
  handleShareEventMyApp(req,res)
}
const getEventShared=(req,res) =>{
  handleGetEventShared(req,res)
}
module.exports = {
  postEventUser,
  getNewEvent,
  ActionHeartForEvent,
  shareEventMyApp,
  getEventShared
};
