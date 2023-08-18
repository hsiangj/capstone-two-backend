const db = require("../db");

const { NotFoundError, BadRequestError } = require("../expressErrors");

class Budget {

/** Given budget id, return data about budget.
  Returns { id, amount, category_id, user_id } 

  Throws NotFoundError if budget not found.
*/

static async get(id) {
  const result = await db.query(`
    SELECT id, amount, category_id, user_id
    FROM budgets
    WHERE id = $1`,
    [id])

  const budget = result.rows[0];
  budget.amount = parseFloat(budget.amount);

  if (!budget) throw new NotFoundError(`No budget id: ${id}`);
  
  return budget;
}

/** Create a budget from data.
    Data should be { amount, category_id, user_id } 
    Returns { id, amount, category_id, user_id } 
*/

static async create({ amount, category_id, user_id }) {
  const duplicateCheck = await db.query(`
    SELECT category_id, user_id
    FROM budgets
    WHERE category_id = $1
    AND user_id = $2`,
    [category_id, user_id])
  
  if (duplicateCheck.rows[0]) throw new BadRequestError(`Budget for category ${category_id} already exists under user ${user_id}`);

  const result = await db.query(`
    INSERT INTO budgets (amount, category_id, user_id)
    VALUES ($1, $2, $3)
    RETURNING id, amount, category_id, user_id`,
    [amount, category_id, user_id])
  
  const budget = result.rows[0];
  budget.amount = parseFloat(budget.amount);
  
  return budget;
}

/** Update budget amount for a specific category_id and user_id combo.
    Returns { id, amount, category_id } 
    Throws NotFoundError if budget not found.
*/

static async update(id, amount) {
  const result = await db.query(`
    UPDATE budgets 
    SET amount = $1
    WHERE id = $2
    RETURNING id, amount, category_id`,
    [amount, id])

  const budget = result.rows[0];
  budget.amount = parseFloat(budget.amount);
  if (!budget) throw new NotFoundError(`No budget id: ${id}`);

  return budget;
}

/** Delete given budget from database; returns undefined. */

static async remove(id) {
  let result = await db.query(`
    DELETE
    FROM budgets
    WHERE id = $1
    RETURNING id`,
    [id]
  )
  const budget = result.rows[0];
  if (!budget) throw new NotFoundError(`No budget id: ${id}`);
}

}

module.exports = Budget;