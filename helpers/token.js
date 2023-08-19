const jwt = require("jsonwebtoken");

/** Return signed JWT token from user data. */

function createToken(user) {
  let payload = {
    id: user.id,
    username: user.username,
  }
  const SECRET_KEY = process.env.JWT_SECRET_KEY;

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };