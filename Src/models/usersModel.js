const { default: mongoose } = require("mongoose");
const UsersSchema= new mongoose.Schema({
    id:{
        type:String,
    },
    name:{
        type:String,
        require:true,
    },
    familyName:{
        type:String,
    },
    givenName:{
        type:String,
    },
    photo:{
        type:String
    },
    sex:{
        type:String
    },
    access:{
        type:String
    }
})
const usersModel= mongoose.model('ActionModel', UsersSchema)
module.exports= usersModel;