/** Routes for authentication. */

const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");

const User = require("../models/user");
const userRegisterSchema = require("../schemas/userRegister.json");
const userAuthSchema = require("../schemas/userAuth.json");
const { createToken } = require("../helpers/token");
const { BadRequestError } = require("../expressErrors");

/** POST /auth/register:   { data } => { user, token }
 * data must include { username, password, firstName, lastName, email }
 * Returns user and JWT token which can be used to authenticate further requests.
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({user, token});

  } catch (err) {
    return next(err);
  }
})

/** POST /auth/login:   { username, password } => { token }
 * Returns JWT token which can be used to authenticate further requests.
 */

router.post("/login", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const {username, password} = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({token});

  } catch (err) {
    return next(err);
  }
})


module.exports = router;