const Router = require("express");
const {
  getAllUsers,
  setUpProfileInfo,
  getUserInfo,
  getListUserForHeartEvent
} = require("../Controller/UsersController");
const usersRouter = Router();
usersRouter.get("/get-all", getAllUsers);
usersRouter.post('/update-users', setUpProfileInfo)
usersRouter.get('/get-user', getUserInfo )
usersRouter.post('/get-list-user', getListUserForHeartEvent)
module.exports = usersRouter;
