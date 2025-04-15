const { Router } = require("express");
const calendarController = require("../controllers/calendarController");
const calendarRouter = Router();
const passport = require("../middleware/passportConfig");

calendarRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  calendarController.createRepetitionCalendar
);
calendarRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  calendarController.getAllRepetitionChapters
);

module.exports = calendarRouter;
