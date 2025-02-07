const Router = require("express");
const {
  handleAddFriends,
  handleCancelFriend,
  handleAgreeFriend,
  handlePressRemoveSuggest,
  handleRemoveFriends,
  handleRemoveRequestFriend
} = require("../Controller/friendController");
const friendRouter = Router();
friendRouter.post("/add", handleAddFriends);
friendRouter.post("/cancel", handleCancelFriend);
friendRouter.post("/agree", handleAgreeFriend);
friendRouter.post("/remove-suggested", handlePressRemoveSuggest);
friendRouter.post("/remove", handleRemoveFriends);
friendRouter.post('/remove-request', handleRemoveRequestFriend)
module.exports = friendRouter;
