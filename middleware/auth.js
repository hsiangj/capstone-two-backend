/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const { UnauthorizedError } = require("../expressErrors");

/** Middleware: Authenticate user and store current user on res.locals. */
function authenticateJWT(req, res, next) {
  try {
    const token = req.body._token;
    const payload = jwt.verify(token, SECRET_KEY);
    res.locals.user = payload;
    return next();

  } catch (err) {
    return next();
  }
}

/** Middleware: Check for valid token and match user with either route param or request body. If not, raise UnauthorizedError. */
function ensureCorrectUser(req, res, next) {
  try {
    const user = res.locals.user;
    if (!(user && (user.id === req.params.id || user.id === req.body.user_id))) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  authenticateJWT,
  ensureCorrectUser
}