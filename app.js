const express = require("express");
const dotenv = require("dotenv");
const geminiRoutes = require("./routers/geminiRouter");

dotenv.config();
const app = express();
app.use(express.json());

// Route prefix: /api/gemini
app.use("/api/gemini", geminiRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
