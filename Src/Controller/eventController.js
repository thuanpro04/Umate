const { handlePostEvent } = require("../Services/eventServices")

const postEventUser= async(req,res) =>{
    handlePostEvent(req, res)
}
module.exports={
    postEventUser
}