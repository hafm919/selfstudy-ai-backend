const express = require("express");
const router = express.Router();
const {
  generateNotes,
  generateFlashcards,
} = require("../controllers/geminiController");

router.post("/notes", generateNotes);
router.post("/cards", generateFlashcards);

module.exports = router;
