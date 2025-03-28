const Router = require("express");
const { handleSearchFriendsByName, getConversationUsers,findFrienForUser } = require("../Controller/searchController");
const searchRouter = Router();
searchRouter.get("/search", handleSearchFriendsByName);
searchRouter.get('/search-conversations', getConversationUsers)
searchRouter.get('/find-friend', findFrienForUser)
module.exports = searchRouter;

