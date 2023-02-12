const express = require("express");
const { header, body, validationResult } = require("express-validator");

// Local Modules
const Notes = require("../models/Notes");
const validateUserJWTToken = require("../middleware/validate");

// Instances
const router = express.Router();

// ROUTE 1: Get All Notes of User using: GET "/api/notes/getAllNotes". Login Required
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

// ROUTE 2: Add a new Notes using: POST "/api/notes/addNote". Login Required
router.post(
  "/addNote",
  validateUserJWTToken,
  [
    header("Authorization", "Enter the JWT Token").exists(),
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    body("description", "Description must be at least 20 characters").isLength({
      min: 20,
    }),
  ],
  async (req, res) => {
    // If there is validation error then return error message with 400 statusCode
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    try {
      let note = await Notes.findOne({
        title: req.body.title,
        user: req.user.id,
      });
      if (note) {
        return res.status(400).json({
          status: false,
          msg: "Note with this title for this user already exists",
        });
      }

      const { title, description, tags } = req.body;

      note = await Notes.create({
        user: req.user.id,
        title,
        description,
        tags,
      });
      return res.status(201).json({ status: true, note });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, msg: "Something went wrong", error });
    }
  }
);
module.exports = router;
