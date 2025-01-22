const express = require("express");
const { postEventUser, getNewEvent, ActionHeartForEvent } = require("../Controller/eventController");
const eventRouter = express();
eventRouter.post("/add-new", postEventUser);
eventRouter.get("/new-event", getNewEvent);
eventRouter.get('/action-heart', ActionHeartForEvent)
module.exports = eventRouter;
