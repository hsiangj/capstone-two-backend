const express = require("express");
const router = express.Router({ mergeParams: true });

const Account = require("../models/account");
const { ensureCorrectUser } = require('../middleware/auth');


/// test route to see if create works in model class Account
router.post("/add", async function (req, res, next) {
  try {
    console.log('accounts/add route:', req.body)
    const account = await Account.create(req.body);
    return res.status(201).json({ account });

  } catch (err) {
    return next(err);
  }
})

/** GET /users/:userId/accounts => { accounts }
 * Returns { id, amount, date, vendor, description, category_id, category, user_id, transaction_id }
 * Authorization required: same user as logged in user
 */

router.get("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const { userId } = req.params;
    const accounts = await Account.getAll(userId);
    return res.json({ accounts });

  } catch (err) {
    return next(err);
  }
})



/** DELETE /users/:userId//accounts/:accountId  =>  { deleted: id }
 * Authorization required: same user as logged in user
 */

router.delete("/:accountId", async function (req, res, next) {
  try {
    await Account.remove(req.params.accountId);
    return res.json({ deleted: req.params.accountId });

  } catch (err) {
    return next(err);
  }
})

module.exports = router;