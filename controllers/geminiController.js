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

const generateMindMapFromText = async (inputText) => {
  const prompt = `
You are an assistant that generates mind maps based on educational content.
Given the following text, break it down into key concepts, and represent it in a mind map format where each concept is a node.
Connect related concepts with edges.

TEXT:
${inputText}

Respond with an object containing the nodes and edges for a mind map in this format:

{
  "nodes": [
    { "id": "1", "label": "Concept 1" },
    { "id": "2", "label": "Concept 2" }
  ],
  "edges": [
    { "source": "1", "target": "2" }
  ]
}

Do NOT include markdown code blocks or extra explanation.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawText = await response.text();

  // Remove any markdown fences just in case
  const cleanText = rawText.replace(/^```json\s*|\s*```$/g, "").trim();

  try {
    const { nodes, edges } = JSON.parse(cleanText);

    // Apply required structure for React Flow
    const positionedNodes = nodes.map((node, index) => ({
      id: node.id,
      data: { label: node.label },
      position: { x: (index % 5) * 200, y: Math.floor(index / 5) * 150 },
    }));

    const validEdges = edges.map((edge, idx) => ({
      id: `e${edge.source}-${edge.target}-${idx}`,
      source: edge.source,
      target: edge.target,
    }));

    return { nodes: positionedNodes, edges: validEdges };
  } catch (error) {
    throw new Error("Error parsing mind map JSON: " + error.message);
  }
};

// Unified controller
const generateNotesAndFlashcards = async (req, res, next) => {
  try {
    const { inputText } = req.body;

    const [notes, flashcards, chapterName, mindMapData] = await Promise.all([
      getNotesFromText(inputText),
      getFlashcardsFromText(inputText),
      getChapterNameFromText(inputText),
      generateMindMapFromText(inputText), // Generate mind map data
    ]);

    req.generatedContent = { notes, flashcards, chapterName, mindMapData };
    next();
  } catch (error) {
    console.error("Unified Notes+Cards Error:", error.message);
    res.status(500).json({ error: "Failed to generate notes and flashcards" });
  }
};

module.exports = {
  generateNotesAndFlashcards,
};
