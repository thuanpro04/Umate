const Router = require("express");
const {
  getAllUsers,
  handleAddFriends,
  handleCancelFriend,
  handleAgreeFriend,
  handlePressRemoveSuggest,
  handleRemoveFriends,
  handleSearchFriendsByName,
} = require("../Controller/UsersController");
const usersRouter = Router();

usersRouter.get("/get-all", getAllUsers);
usersRouter.get("/search", handleSearchFriendsByName);
usersRouter.post("/add-friend", handleAddFriends);
usersRouter.post("/cancel-friend", handleCancelFriend);
usersRouter.post("/agree-friend", handleAgreeFriend);
usersRouter.post("/remove-suggested-friend", handlePressRemoveSuggest);
usersRouter.post('/remove-friend', handleRemoveFriends)
module.exports = usersRouter;
