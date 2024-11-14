const Express = require("express");
const { handleAddGroupUser } = require("../Controller/groupController");
const groupRouter = Express();
groupRouter.post("/new-group", handleAddGroupUser);
module.exports = groupRouter;
