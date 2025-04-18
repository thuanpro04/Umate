const express = require("express");
const {
  postEventUser,
  getNewEvent,
  ActionHeartForEvent,
  shareEventMyApp,
  getEventShared
} = require("../Controller/eventController");
const eventRouter = express();
eventRouter.post("/add-new", postEventUser);
eventRouter.get("/new-event", getNewEvent);
eventRouter.get("/action-heart", ActionHeartForEvent);
eventRouter.post("/share-event", shareEventMyApp);
eventRouter.post("/get-event", getEventShared)
module.exports = eventRouter;

