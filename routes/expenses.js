/** Routes for expenses. */

const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");

const Expense = require("../models/expense");
const expenseNewSchema = require("../schemas/expenseNew.json");
const expenseUpdateSchema = require("../schemas/expenseUpdate.json");
const { BadRequestError } = require("../expressErrors");

/** GET /expenses/[id] => { expense }
 * Returns { id, amount, date, vendor, description, transaction}
 *   where budgets is { id, amount, category }
      and expenses is { id, amount. date, vendor, description, category }
 * Authorization required: same user as username
 */

router.get("/:id", async function (req, res, next) {
  try {
    const expense = await Expense.get(req.params.id);
    return res.json({ expense });

  } catch (err) {
    return next(err);
  }
})

/** GET /expenses {user_id} => { expense: [{id, amount, date, vendor, description, category_id, transaction_id},...] }
 *
 * Authorization required: same user as username
 */

router.get("/", async function (req, res, next) {
  try {
    const expenses = await Expense.findAll(req.body);
    return res.json({ expenses });

  } catch (err) {
    return next(err);
  }
})



/** POST /expenses { expense } => { expense }
 * Expense should be: { amount, date, vendor, description, category_id, user_id, transaction_id } 
 * Both description and transaction are optional. 
 * Returns { id, amount, date, vendor, description, category_id, user_id, transaction_id } 
 * Authorization required: same user as username
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, expenseNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const expense = await Expense.create(req.body);
    return res.status(201).json({ expense });

  } catch (err) {
    return next(err);
  }
})

/** PATCH /expenses/[id] { expense } => { expense }
 * Data can include: { amount, date, vendor, description, category_id  }
 * Returns { id, amount, date, vendor, description, category_id }
 * Authorization required: same user as username
 */

router.patch("/:id", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, expenseUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
   
    const expense = await Expense.update(req.params.id,req.body);
    return res.json({ expense })

  } catch(err) {
    return next(err);
  }
})


/** DELETE /users/[id]  =>  { deleted: username }
 * Authorization required: same user as username
 */

router.delete("/:id", async function (req, res, next) {
  try {
    await Expense.remove(req.params.id);
    return res.json({ deleted: req.params.id });
    
  } catch (err) {
    return next(err);
  }
})
  


module.exports = router;