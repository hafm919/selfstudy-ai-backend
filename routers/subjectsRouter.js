const express = require("express");
const subjectsRouter = express.Router();
const upload = require("../middleware/upload");
const parsePDF = require("../middleware/parsePDF");
const passport = require("../middleware/passportConfig");
const geminiController = require("../controllers/geminiController");
const subjectsController = require("../controllers/subjectsController");

subjectsRouter.post(
  "/chapter",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  parsePDF,
  geminiController.generateNotesAndFlashcards,
  subjectsController.saveChapter
);

subjectsRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  subjectsController.createSubject
);

module.exports = subjectsRouter;
