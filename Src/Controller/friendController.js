const {
  handleFriendRequestAction,
  processRemoveFriendAction,
  manageFriendship,
  removeFriendSuggestion,
  removeFriendRequest,
} = require("../Services/friendServices");
const handleAddFriends = (req, res) => {
  handleFriendRequestAction(req, res, "add");
};

const handleCancelFriend = (req, res) => {
  handleFriendRequestAction(req, res, "cancel");
};

const handleAgreeFriend = (req, res) => {
  manageFriendship(req, res, "agree");
};
const handlePressRemoveSuggest = (req, res) => {
  removeFriendSuggestion(req, res);
};

const handleRemoveFriends = (req, res) => {
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
