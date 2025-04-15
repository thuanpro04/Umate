const router = require("express");
const {
  actionMyPostEvent,
  actionGetEventForUser,
  actionLikePostForUser,
  actionOpenLink,
  actionGetMyPost,
  actionRemovePost,
  actionRemovePostShare,
  actionHidePost,
  actionUpdatePrivacy,
  actionCreateComment,
  actionGetComments,
  actionAddReplyComment,
} = require("../Controller/postController");

const postRouter = router();
postRouter.post("/event", actionMyPostEvent);
postRouter.get("/get-event", actionGetEventForUser);
postRouter.post("/like", actionLikePostForUser);
postRouter.get("/open/:id", actionOpenLink);
postRouter.get("/my-post", actionGetMyPost);
postRouter.get("/remove/:id", actionRemovePost);
postRouter.get("/remove-share", actionRemovePostShare);
postRouter.post("/hide", actionHidePost);
postRouter.post("/u-privacy", actionUpdatePrivacy);
postRouter.post("/create", actionCreateComment);
postRouter.get("/comments", actionGetComments);
postRouter.post("/r-comment", actionAddReplyComment);
module.exports = postRouter;
