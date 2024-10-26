const {
  handleFriendRequestAction,
  processRemoveFriendAction,
  manageFriendship,
  removeFriendSuggestion
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
  processRemoveFriendAction(req, res);
};

module.exports = {
  handleAddFriends,
  handleCancelFriend,
  handleAgreeFriend,
  handlePressRemoveSuggest,
  handleRemoveFriends,
};
