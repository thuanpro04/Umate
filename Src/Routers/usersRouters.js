const Router = require("express");
const {
  getAllUsers,
  setUpProfileInfo,

} = require("../Controller/UsersController");
const usersRouter = Router();
usersRouter.get("/get-all", getAllUsers);
usersRouter.post('/update-users', setUpProfileInfo)
module.exports = usersRouter;
