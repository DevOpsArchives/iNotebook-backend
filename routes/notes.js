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

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updateNote". Login Required
router.put("/updateNote/:id", validateUserJWTToken, [
  header("Authorization", "Enter the JWT Token").exists(),
  body("title", "Enter a valid Title").isLength({ min: 3 }),
  body("description", "Description must be at least 20 characters").isLength({
    min: 20,
  }),
  async (req, res) => {
    // If there is validation error then return error message with 400 statusCode
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    try {
      const { title, description, tag } = req.body;

      const newNote = {};
      if (title) newNote.title = title;
      if (description) newNote.description = description;
      if (tag) newNote.tag = tag;

      // Find the note to be updated and update it
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ status: false, msg: "Not found" });
      }

      // Check if the user has permission to access this note
      if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "Not allowed" });
      }

      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      return res.status(200).json({ status: true, note });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: false, msg: "Something went wrong", error });
    }
  },
]);

// ROUTE 4: delete an existing Note using: DELETE "/api/notes/deleteNote". Login Required
router.delete("/deleteNote/:id", validateUserJWTToken, async (req, res) => {
  try {
    // Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ status: false, msg: "Not found" });
    }

    // Check if the user has permission to delete this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not allowed" });
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    return res.status(200).json({ status: true, note });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, msg: "Something went wrong", error });
  }
});

module.exports = router;
