const fs = require("fs");
const pdfParse = require("pdf-parse");

const parsePDF = async (req, res, next) => {
  try {
    if (req.body.inputText) return next();

    if (!req.file) {
      return res.status(400).json({ error: "No text or PDF file provided" });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(pdfBuffer);
    fs.unlinkSync(req.file.path);

    req.body.inputText = data.text;
    next();
  } catch (error) {
    console.error("PDF Parse Error:", error.message);
    res.status(500).json({ error: "Failed to parse PDF" });
  }
};

module.exports = parsePDF;
