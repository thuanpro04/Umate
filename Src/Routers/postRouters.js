const router = require("express");
const {
  actionMyPostEvent,
  actionGetEventForUser,
  actionLikePostForUser,actionOpenLink
} = require("../Controller/postController");
const postRouter = router();
postRouter.post("/event", actionMyPostEvent);
postRouter.get("/get-event", actionGetEventForUser);
postRouter.post('/like', actionLikePostForUser)
postRouter.get("/open/:id", actionOpenLink)
module.exports = postRouter;
