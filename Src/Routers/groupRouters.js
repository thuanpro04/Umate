const Express = require("express");
const { handleAddGroupUser,actionAgreeOnGroup } = require("../Controller/groupController");
const groupRouter = Express();
groupRouter.post("/new-group", handleAddGroupUser);
groupRouter.post('/agree', actionAgreeOnGroup)
module.exports = groupRouter;
