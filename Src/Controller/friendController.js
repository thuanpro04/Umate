const {
  handleFriendRequestAction,
  processRemoveFriendAction,
  manageFriendship,
  removeFriendSuggestion,
  removeFriendRequest
} = require("../Services/friendServices");
const handleAddFriends = (req, res) => {
  handleFriendRequestAction(req, res, "add");
};

const handleCancelFriend = (req, res) => {
  handleFriendRequestAction(req, res, "cancel");
};

const handleAgreeFriend = async (req, res) => {
  manageFriendship(req, res, "agree");
};
const handlePressRemoveSuggest = async (req, res) => {
  removeFriendSuggestion(req, res);
};

const handleRemoveFriends = async (req, res) => {
  console.log(req.body);

  processRemoveFriendAction(req, res);
};
const handleRemoveRequestFriend = (req, res) => {
  removeFriendRequest(req, res);
};
module.exports = {
  handleAddFriends,
  handleCancelFriend,
  handleAgreeFriend,
  handlePressRemoveSuggest,
  handleRemoveFriends,
  handleRemoveRequestFriend,
};
