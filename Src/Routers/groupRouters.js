const Express = require("express");
const { handleAddGroupUser,actionAgreeOnGroup,actionOutGroup,actionPosition } = require("../Controller/groupController");
const groupRouter = Express();
groupRouter.post("/new-group", handleAddGroupUser);
groupRouter.post('/agree', actionAgreeOnGroup)
groupRouter.get('/out-group', actionOutGroup)
groupRouter.post('/position', actionPosition)
module.exports = groupRouter;
