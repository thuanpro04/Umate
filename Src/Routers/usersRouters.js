const Router = require("express");
const {
  getAllUsers,
  setUpProfileInfo,
  getUserInfo,

} = require("../Controller/UsersController");
const usersRouter = Router();
usersRouter.get("/get-all", getAllUsers);
usersRouter.post('/update-users', setUpProfileInfo)
usersRouter.get('/get-user', getUserInfo )
module.exports = usersRouter;
