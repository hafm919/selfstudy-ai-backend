const model = require("../utils/geminiClient");

// --- /notes endpoint ---
const generateNotes = async (req, res) => {
  try {
    const { inputText } = req.body;

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

    const response = result.response;
    const rawText = await response.text();

    // Clean response: remove intro, code fences, etc.
    let cleanedText = rawText
      .replace(/(^.*?(?=##|\n##))/s, "") // Remove anything before first markdown heading
      .replace(/```(markdown)?/g, "") // Remove markdown code blocks
      .trim();

    res.status(200).json({ notes: cleanedText });
  } catch (error) {
    console.error("Gemini Notes Error:", error.message);
    res.status(500).json({ error: "Failed to generate notes" });
  }
};

// --- /cards endpoint ---
const generateFlashcards = async (req, res) => {
  try {
    const { inputText } = req.body;

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

    const response = result.response;
    const rawText = await response.text();

    // Extract the JSON array from the response
    const jsonStart = rawText.indexOf("[");
    const jsonEnd = rawText.lastIndexOf("]");
    const jsonString = rawText.slice(jsonStart, jsonEnd + 1);

    let flashcards;
    try {
      flashcards = JSON.parse(jsonString);
    } catch (parseErr) {
      return res.status(500).json({
        error:
          "Failed to parse flashcards. Gemini might have returned an unexpected format.",
        raw: rawText,
      });
    }

    res.status(200).json({ flashcards });
  } catch (error) {
    console.error("Gemini Flashcard Error:", error.message);
    res.status(500).json({ error: "Failed to generate flashcards" });
  }
};

module.exports = {
  generateNotes,
  generateFlashcards,
};
