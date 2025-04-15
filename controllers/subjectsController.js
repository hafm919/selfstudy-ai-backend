const model = require("../utils/geminiClient");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createSubject = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: "Subject name is required." });
    }

    const subject = await prisma.subject.create({
      data: {
        name: name,
        userId: userId,
      },
    });

    res.status(201).json({ message: "Subject created successfully!", subject });
  } catch (error) {
    console.error("Create Subject Error:", error.message);
    res.status(500).json({ error: "Failed to create subject" });
  }
};

const getAllSubjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const subjects = await prisma.subject.findMany({ where: { userId } });
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Get Subjects Error:", error.message);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

const getChapterNames = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const chapters = await prisma.chapter.findMany({
      where: { subjectId },
      select: {
        id: true,
        title: true,
      },
    });

    res.status(200).json(chapters);
  } catch (error) {
    console.error("Get Chapters Error:", error.message);
    res.status(500).json({ error: "Failed to fetch chapters" });
  }
};

const saveChapter = async (req, res) => {
  console.log("Entered save chapter");
  try {
    const { notes, flashcards, chapterName } = req.generatedContent;
    const { subjectId } = req.params;

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
      select: {
        id: true,
        title: true,
      },
    });

    res.status(201).json(newChapter);
  } catch (error) {
    console.error("Error saving content:", error.message);
    res.status(500).json({ error: "Failed to save generated content" });
  }
};

const getChapterNotes = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
      select: {
        title: true,
        notes: true,
      },
    });

    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    // Clean up notes: trim, remove extra newlines and spaces
    const cleanedNotes = chapter.notes
      ?.trim()
      .replace(/\r\n|\r/g, "\n") // normalize line endings
      .replace(/\n{3,}/g, "\n\n") // limit consecutive newlines to 2
      .replace(/[ \t]+/g, " ") // replace multiple spaces/tabs with single space
      .replace(/ +\n/g, "\n") // remove trailing spaces before newlines
      .trim();

    res.json({
      title: chapter.title,
      notes: cleanedNotes,
    });
  } catch (error) {
    console.error("Error fetching chapter notes:", error.message);
    res.status(500).json({ error: "Failed to retrieve chapter notes" });
  }
};

const getChapterFlashCards = async (req, res) => {
  const { chapterId } = req.params;

  try {
    const flashcards = await prisma.flashcard.findMany({
      where: { chapterId },
    });

    res.status(200).json(flashcards);
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createSubject,
  saveChapter,
  getAllSubjects,
  getChapterNames,
  getChapterNotes,
  getChapterFlashCards,
};
