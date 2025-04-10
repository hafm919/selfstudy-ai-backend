const model = require("../utils/geminiClient");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createSubject = async (req, res) => {
  try {
    const { name } = req.body; // Assuming the subject name is passed in the body
    const userId = req.user.id; // User ID comes from JWT (passport.authenticate("jwt", ...))

    // Check if subject name is provided
    if (!name) {
      return res.status(400).json({ error: "Subject name is required." });
    }

    // Create a new subject and associate it with the user
    const subject = await prisma.subject.create({
      data: {
        name: name,
        userId: userId, // Linking the subject to the user via userId
      },
    });

    res.status(201).json({ message: "Subject created successfully!", subject });
  } catch (error) {
    console.error("Create Subject Error:", error.message);
    res.status(500).json({ error: "Failed to create subject" });
  }
};

const saveChapter = async (req, res) => {
  try {
    const { notes, flashcards, chapterName } = req.generatedContent;
    const { subjectId } = req.body;

    const newChapter = await prisma.chapter.create({
      data: {
        title: chapterName,
        notes: notes,
        flashcards: {
          create: flashcards.map((flashcard) => ({
            question: flashcard.question,
            answer: flashcard.answer,
          })),
        },
        subjectId: subjectId,
      },
    });

    res
      .status(201)
      .json({ message: "Chapter created successfully!", chapter: newChapter });
  } catch (error) {
    console.error("Error saving content:", error.message);
    res.status(500).json({ error: "Failed to save generated content" });
  }
};

module.exports = {
  createSubject,
  saveChapter,
};
