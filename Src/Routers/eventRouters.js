const express = require("express");
const { postEventUser } = require("../Controller/eventController");
const eventRouter = express();
eventRouter.post("/add-new", postEventUser);
module.exports = eventRouter;
