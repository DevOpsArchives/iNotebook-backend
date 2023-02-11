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

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Running App
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
