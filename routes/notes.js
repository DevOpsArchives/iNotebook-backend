const express = require("express");
const { header, validationResult } = require("express-validator");

// Local Modules
const Notes = require("../models/Notes");
const validateUserJWTToken = require("../middleware/validate");

// Instances
const router = express.Router();

// ROUTE 1: Get All Notes of User: GET "/api/notes/getAllNotes". Login Required
router.get(
  "/getAllNotes",
  validateUserJWTToken,
  [header("Authorization", "Enter the JWT Token").exists()],
  async (req, res) => {
    // If there is validation error then return error message with 400 statusCode
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const notes = await Notes.find({ user: req.user.id });
    return res.json(notes);
  }
);

// ROUTE 2: Get All Notes of User: GET "/api/notes/getAllNotes". Login Required
router.get(
  "/getAllNotes",
  validateUserJWTToken,
  [header("Authorization", "Enter the JWT Token").exists()],
  async (req, res) => {
    // If there is validation error then return error message with 400 statusCode
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const notes = await Notes.find({ user: req.user.id });
    return res.json(notes);
  }
);
module.exports = router;
