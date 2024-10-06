const Router = require("express");
const {
  getAllUsers,
  handleAddFriends,
  handleCancelFriend,
  handleAgreeFriend,
  getYourFriends,
  handlePressRemove,
} = require("../Controller/UsersController");
const usersRouter = Router();

usersRouter.get("/get-all", getAllUsers);
usersRouter.post("/add-friend", handleAddFriends);
usersRouter.post("/cancel-friend", handleCancelFriend);
usersRouter.post("/agree-friend", handleAgreeFriend);
usersRouter.get("/your-friend", getYourFriends);
usersRouter.post("/remove-suggested-friend", handlePressRemove);

module.exports = usersRouter;
