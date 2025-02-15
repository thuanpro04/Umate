const Router = require("express");
const {
  getAllUsers,
  setUpProfileInfo,
  getUserInfo,
  getListUserForHeartEvent,
  updateStatusUser,
  actionBlockUser,
  updateFcmTokenForUser,
} = require("../Controller/UsersController");
const usersRouter = Router();
usersRouter.get("/get-all", getAllUsers);
usersRouter.post("/update-users", setUpProfileInfo);
usersRouter.get("/get-user", getUserInfo);
usersRouter.post("/get-list-user", getListUserForHeartEvent);
usersRouter.get("/update-status", updateStatusUser);
usersRouter.post("/block-user", actionBlockUser);
usersRouter.post("/update-fcmtoken", updateFcmTokenForUser);
module.exports = usersRouter;

