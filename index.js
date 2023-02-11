const dotenv = require("dotenv");
const express = require("express");

// Local Imports
const connectToMongo = require("./db");

// SetUp Configs
dotenv.config();
connectToMongo();

// Global Variables
const app = express();
const port = process.env.PORT;

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// Running App
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
