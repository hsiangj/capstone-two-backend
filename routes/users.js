/** Routes for users. */

const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");

const User = require("../models/user");
const userUpdateSchema = require("../schemas/userUpdate.json");
const { BadRequestError } = require("../expressErrors");

/** GET /users/[id] => { user }
 * Returns { username, firstName, lastName, email, budgets, expenses}
 *   where budgets is { id, amount, category }
      and expenses is { id, amount. date, vendor, description, category }
 * Authorization required: same user as username
 */

router.get("/:id", async function (req, res, next) {
  try {
    const user = await User.get(req.params.id);
    return res.json({ user });

  } catch(err) {
    return next(err);
  }
})

/** PATCH /users/[id] { user } => { user }
 * Data can include: { username, firstName, lastName, email }
 * Returns { id, username, firstName, lastName, email }
 * Authorization required: same user as username
 */

router.patch("/:id", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { password } = req.body;
    delete req.body.password;
    const user = await User.update(req.params.id, password, req.body);
    return res.json({ user })

  } catch(err) {
    return next(err);
  }
})

/** DELETE /[username]  =>  { deleted: username }
 * Authorization required: same user as username
 */

router.delete("/:id", async function (req, res, next) {
  try {
    const user = await User.remove(req.params.id);
    return res.json({ deleted: user })

  } catch (err) {
    return next(err);
  }
})

module.exports = router;