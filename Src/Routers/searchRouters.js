const Router = require("express");
const { handleSearchFriendsByName, getConversationUsers } = require("../Controller/searchController");
const searchRouter = Router();
searchRouter.get("/search", handleSearchFriendsByName);
searchRouter.get('/search-conversations', getConversationUsers)
module.exports = searchRouter;
