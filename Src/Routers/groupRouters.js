const Express = require("express");
const {
  handleAddGroupUser,
  actionAgreeOnGroup,
  actionOutGroup,
  actionPosition,
  updateAttendedGroup,
} = require("../Controller/groupController");
const groupRouter = Express();
groupRouter.post("/new-group", handleAddGroupUser);
groupRouter.post("/agree", actionAgreeOnGroup);
groupRouter.get("/out-group", actionOutGroup);
groupRouter.post("/position", actionPosition);
groupRouter.post("/update-attend", updateAttendedGroup);
module.exports = groupRouter;
