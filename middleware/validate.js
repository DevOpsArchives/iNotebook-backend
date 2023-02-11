const jwt = require("jsonwebtoken");

// Environment Variables
const JWT_SECRET = process.env.JWT_SECRET;

const validateUserJWTToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");

    const token = bearer[1];

    try {
      const data = jwt.verify(token, JWT_SECRET);
      req.user = data.user;
      next(); // call the next method/middleware in line
    } catch (err) {
      console.log(err);
      return res.status(403).json({
        status: false,
        message: "Invalid token, login with valid credentials",
      });
    }
  } else {
    return res.status(401).json({
      status: false,
      message: "Please login, and validate credentials",
    });
  }
};

module.exports = validateUserJWTToken;
