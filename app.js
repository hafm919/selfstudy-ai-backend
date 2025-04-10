const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const passport = require("./middleware/passportConfig");

const geminiRoutes = require("./routers/geminiRouter");
const subjectsRouter = require("./routers/subjectsRouter");
const authRouter = require("./routers/authRouter");

//initalization and setup
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
  })
);

//routes
app.use("/api/subjects", subjectsRouter);
app.use("/api/auth", authRouter);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
