const model = require("../utils/geminiClient");

// Shared logic
const getChapterNameFromText = async (text) => {
  const prompt = `
You are an assistant that helps generate chapter names from educational content.
Given the following text, return a concise and meaningful chapter name for it. Keep it short and relevant.

TEXT:
${text}

Respond with just the chapter name.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
};
async function getNotesFromText(inputText) {
  const result = await model.generateContent(`
    Summarize the following content into markdown notes.

    Do NOT include any introduction, explanations, or code blocks.
    Just return raw markdown notes, starting with headings.

    ${inputText}

    Format:
    ## Topic Title
    - Key Point 1
    - Key Point 2
  `);

  const rawText = await result.response.text();

  return rawText
    .replace(/(^.*?(?=##|\n##))/s, "")
    .replace(/```(markdown)?/g, "")
    .trim();
}

async function getFlashcardsFromText(inputText) {
  const result = await model.generateContent(`
    Generate 5 flashcards based on the study material below. Each flashcard should be a JSON object with a "question" and an "answer".

    ONLY return a raw JSON array. Do NOT include code fences, markdown, or explanations.

    ${inputText}

    Format:
    [
      { "question": "...", "answer": "..." },
      ...
    ]
  `);

  const rawText = await result.response.text();
  const jsonStart = rawText.indexOf("[");
  const jsonEnd = rawText.lastIndexOf("]");
  const jsonString = rawText.slice(jsonStart, jsonEnd + 1);

  return JSON.parse(jsonString);
}

// Unified controller
const generateNotesAndFlashcards = async (req, res, next) => {
  try {
    const { inputText } = req.body;

    const [notes, flashcards, chapterName] = await Promise.all([
      getNotesFromText(inputText),
      getFlashcardsFromText(inputText),
      getChapterNameFromText(inputText),
    ]);

    req.generatedContent = { notes, flashcards, chapterName };
    next();
  } catch (error) {
    console.error("Unified Notes+Cards Error:", error.message);
    res.status(500).json({ error: "Failed to generate notes and flashcards" });
  }
};

module.exports = {
  generateNotesAndFlashcards,
};
