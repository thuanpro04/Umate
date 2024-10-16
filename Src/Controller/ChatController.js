const { handleReceiveMessageUsers } = require("../Services/chatServices")

const receiveMessageUsers =async (req,res)=>{
    handleReceiveMessageUsers(req, res);
}
module.exports={
    receiveMessageUsers
}