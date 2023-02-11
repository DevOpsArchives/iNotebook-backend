const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Local Modules
const User = require("../models/Users");

// Instances
const router = express.Router();

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;

router.post(
  "/createUser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
    body("password", "Password must be alpha numeric").isAlphanumeric(),
  ],
  async (req, res) => {
    // If there is validation error then return error message with 400 statusCode
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(403)
          .json({ status: false, msg: "User with this email already exists" });
      }

      let salt = await bcrypt.genSalt(10);
      let securePassword = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });

      const authToken = jwt.sign({ user: { id: user.id } }, JWT_SECRET);

      return res.json({ status: true, token: authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ status: false, msg: "Something went wrong" });
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").exists(),
  ],
  async (req, res) => {
    // If there is validation error then return error message with 400 statusCode
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Try to login with correct credentials" });
      }

      const authToken = jwt.sign({ user: { id: user.id } }, JWT_SECRET);
      return res.json({ status: true, token: authToken });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, msg: "Something went wrong" });
    }
  }
);

module.exports = router;
