const { searchFriendByName, handleSearchConversations } = require("../Services/searchServices");

const handleSearchFriendsByName=async (req, res)=>{
    searchFriendByName(req, res);
  }
  const getConversationUsers = async(req, res) =>{
    handleSearchConversations(req,res)
  }
  module.exports={
    handleSearchFriendsByName,
    getConversationUsers
  }