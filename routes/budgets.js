/** Routes for budgets. */

const express = require("express");
const router = express.Router({ mergeParams: true });
const jsonschema = require("jsonschema");

const Budget = require("../models/budget");
const budgetNewSchema = require("../schemas/budgetNew.json");
const budgetUpdateSchema = require("../schemas/budgetUpdate.json");
const { BadRequestError } = require("../expressErrors");

/** GET /users/:userId/budgets/:budgetId => { budget }
 * Returns { id, amount, category_id, category, user_id }
 * Authorization required: same user as user id
 */

router.get("/:budgetId", async function (req, res, next) {
  try {
    const budget = await Budget.get(req.params.budgetId);
    return res.json({ budget });
    
  } catch (err) {
    return next(err);
  }
})

/** GET /users/:userId/budgets => { budgets } 
 * Returns { budgets: [{id, amount, category_id, category },...] }
 *
 * Authorization required: same user as logged in user
 */

router.get("/", async function (req, res, next) {
  try {
    const budgets = await Budget.getAll(req.params.userId);
    return res.json({ budgets })

  } catch (err) {
    return next(err);
  }
})

/** POST /users/:userId/budgets { budget } => { budget }
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
   
    const budget = await Budget.create(req.params.userId, req.body);
    return res.status(201).json({ budget });

  } catch (err) {
    return next(err);
  }
})

/** PATCH /users/:userId/budgets/:budgetId { budget } => { budget }
 * Data can include: { amount, date, vendor, description, category_id  }
 * Returns { id, amount, category_id }
 * Authorization required: same user as logged in user
 */

router.patch("/:budgetId", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, budgetUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    
    const {userId, budgetId} = req.params;
    const budget = await Budget.update(userId, budgetId, req.body.amount);
    return res.json({ budget});

  } catch (err) {
    return next(err);
  }
})

/** DELETE /budgets/:budgetId  =>  { deleted: budgetId }
 * Authorization required: same user as logged in user
 */

router.delete("/:budgetId", async function (req, res, next) {
  try {
    const {userId, budgetId} = req.params;
    await Budget.remove(userId, budgetId);
    return res.json({ deleted: budgetId });
    
  } catch (err) {
    return next(err);
  }
})

module.exports = router;