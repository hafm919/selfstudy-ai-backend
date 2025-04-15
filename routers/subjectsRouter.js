const express = require("express");
const subjectsRouter = express.Router();
const upload = require("../middleware/upload");
const parsePDF = require("../middleware/parsePDF");
const passport = require("../middleware/passportConfig");
const geminiController = require("../controllers/geminiController");
const subjectsController = require("../controllers/subjectsController");

subjectsRouter.post(
  "/:subjectId/chapter",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  parsePDF,
  geminiController.generateNotesAndFlashcards,
  subjectsController.saveChapter
);

subjectsRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  subjectsController.getAllSubjects
);

subjectsRouter.get(
  "/:subjectId/chapter",
  passport.authenticate("jwt", { session: false }),
  subjectsController.getChapterNames
);

subjectsRouter.get(
  "/:subjectId/chapter/:chapterId/notes",
  passport.authenticate("jwt", { session: false }),
  subjectsController.getChapterNotes
);

subjectsRouter.get(
  "/:subjectId/chapter/:chapterId/flashcards",
  passport.authenticate("jwt", { session: false }),
  subjectsController.getChapterFlashCards
);

subjectsRouter.get(
  "/:subjectId/chapter/:chapterId/mindmap",
  passport.authenticate("jwt", { session: false }),
  subjectsController.getChapterMindMap
);

// subjectsRouter.get(
//   "/:subjectId/chapter/:chapterId",
//   passport.authenticate("jwt", { session: false }),
//   subjectsController.getChapter
// );

subjectsRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  subjectsController.createSubject
);

module.exports = subjectsRouter;
