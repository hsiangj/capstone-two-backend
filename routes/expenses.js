/** Routes for expenses. */

const express = require("express");
const router = express.Router({ mergeParams: true });
const jsonschema = require("jsonschema");

const Expense = require("../models/expense");
const expenseNewSchema = require("../schemas/expenseNew.json");
const expenseUpdateSchema = require("../schemas/expenseUpdate.json");
const { BadRequestError } = require("../expressErrors");

/** GET /users/:userId/expenses/:expenseId => { expense }
 * Returns { id, amount, date, vendor, description, category_id, category, user_id, transaction_id }
 * Authorization required: same user as logged in user
 */

router.get("/:expenseId", async function (req, res, next) {
  try {
    const { userId, expenseId } = req.params;
    const expense = await Expense.get(userId, expenseId);
    return res.json({ expense });

  } catch (err) {
    return next(err);
  }
})

/** GET /users/:userId/expenses => { expenses } 
 * Returns { expenses: [{id, amount, date, vendor, description, category_id, category, transaction_id},...] }
 *
 * Authorization required: same user as logged in user
 */

router.get("/", async function (req, res, next) {
  try {
    const expenses = await Expense.findAll(req.params.userId);
    return res.json({ expenses });

  } catch (err) {
    return next(err);
  }
})

/** POST /users/:userId/expenses { expense } => { expense }
 * Expense should be: { amount, date, vendor, description, category_id, transaction_id } 
 * Vendor, description and transaction_id are optional. 
 * Returns { id, amount, date, vendor, description, category_id, user_id, transaction_id } 
 * Authorization required: same user as logged in user
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, expenseNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { userId } = req.params;
    const expense = await Expense.create(userId, req.body);
    return res.status(201).json({ expense });

  } catch (err) {
    return next(err);
  }
})

/** PATCH /users/:userId/expenses/:expenseId { expense } => { expense }
 * Data can include: { amount, date, vendor, description, category_id  }
 * Returns { id, amount, date, vendor, description, category_id }
 * Authorization required: same user as logged in user
 */

router.patch("/:expenseId", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, expenseUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { userId, expenseId } = req.params;
    const expense = await Expense.update(userId, expenseId,req.body);
    return res.json({ expense })

  } catch(err) {
    return next(err);
  }
})

/** DELETE /users/:userId/expenses/:expenseId  =>  { deleted: id }
 * Authorization required: same user as logged in user
 */

router.delete("/:expenseId", async function (req, res, next) {
  try {
    const { userId, expenseId } = req.params;
    await Expense.remove(userId, expenseId);
    return res.json({ deleted: expenseId });
    
  } catch (err) {
    return next(err);
  }
})
  


module.exports = router;