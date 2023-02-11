const express = require("express");
const { body, validationResult } = require("express-validator");

const User = require("../models/Users");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
    body("password", "Password must be alpha numeric").isAlphanumeric(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      .then((user) => res.json(user))
      .catch((err) => {
        res.status(403).json({ msg: "User already exists", error: err });
      });
  }
);

module.exports = router;
