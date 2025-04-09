const router = require("express");
const {
  actionMyPostEvent,
  actionGetEventForUser,
} = require("../Controller/postController");
const postRouter = router();
postRouter.post("/event", actionMyPostEvent);
postRouter.get("/get-event", actionGetEventForUser);
module.exports = postRouter;
