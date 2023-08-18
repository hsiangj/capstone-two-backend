/** Routes for budgets. */

const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");

const Budget = require("../models/budget");
const budgetNewSchema = require("../schemas/budgetNew.json");
const budgetUpdateSchema = require("../schemas/budgetUpdate.json");
const { BadRequestError } = require("../expressErrors");

/** GET /budgets/[id] => { budget }
 * Returns { id, amount, category_id, user_id }
 * Authorization required: same user as user id
 */

router.get("/:id", async function (req, res, next) {
  try {
    const budget = await Budget.get(req.params.id);
    return res.json({ budget });
    
  } catch (err) {
    return next(err);
  }
})

/** POST /budgets { budget } => { budget }
 * Budget should be: { amount, category_id, user_id } 
 * Returns { id, amount, category_id, user_id } 
 * Authorization required: same user as user id
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, budgetNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const budget = await Budget.create(req.body);
    return res.status(201).json({ budget });

  } catch (err) {
    return next(err);
  }
})

/** PATCH /budgets/[id] { budget } => { budget }
 * Data can include: { amount, date, vendor, description, category_id  }
 * Returns { id, amount, category_id }
 * Authorization required: same user as logged in user
 */

router.patch("/:id", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, budgetUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const budget = await Budget.update(req.params.id, req.body.amount);
    return res.json({ budget});

  } catch (err) {
    return next(err);
  }
})

/** DELETE /budgets/[id]  =>  { deleted: id }
 * Authorization required: same user as logged in user
 */

router.delete("/:id", async function (req, res, next) {
  try {
    await Budget.remove(req.params.id);
    return res.json({ deleted: req.params.id });
    
  } catch (err) {
    return next(err);
  }
})

module.exports = router;