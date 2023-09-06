const db = require("../db");

const { NotFoundError, BadRequestError } = require("../expressErrors");

class Budget {

/** Given budget id, return data about budget.
  Returns { id, amount, category_id, category, user_id } 

  Throws NotFoundError if budget not found.
*/

static async get(user_id, budget_id) {
  const result = await db.query(`
    SELECT b.id, amount, category_id, category, user_id
    FROM budgets b
    JOIN categories c
    ON b.category_id = c.id
    WHERE b.id = $1
    AND user_id = $2`,
    [budget_id, user_id])

  const budget = result.rows[0];
  if (!budget) throw new NotFoundError(`No budget id: ${budget_id}`);

  budget.amount = parseFloat(budget.amount);

  return budget;
}

/** Find all budgets for a single user based on user id.
    Returns [{ budget_id, amount, category_id }, ...]
*/

static async getAll(user_id) {
  const result = await db.query(`
    SELECT b.id AS budget_id, amount, category, c.id AS category_id
    FROM categories c
    LEFT JOIN budgets b
    ON b.category_id = c.id
    AND user_id = $1`,
    [user_id]);

  return result.rows;
}

/** Create a budget from data.
    Data should be { amount, category_id } 
    Returns { budget_id, amount, category_id, user_id } 
*/

static async create(user_id, { amount, category_id }) {
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
    RETURNING id AS budget_id, amount, category_id,
    (SELECT category FROM categories WHERE id = $2)`,
    [amount, category_id, user_id])
  
  const budget = result.rows[0];
  budget.amount = parseFloat(budget.amount);
  
  return budget;
}

/** Update budget amount for a specific budget_id.
    Returns { budget_id, amount, category_id } 
    Throws NotFoundError if budget not found.
*/

static async update(user_id, budget_id, amount) {
  const result = await db.query(`
    UPDATE budgets 
    SET amount = $1
    WHERE id = $2
    AND user_id = $3
    RETURNING id AS budget_id, amount, category_id`,
    [amount, budget_id, user_id])
  
  const budget = result.rows[0];
  if (!budget) throw new NotFoundError(`No budget id: ${budget_id}`);

  budget.amount = parseFloat(budget.amount);
  
  return budget;
}

/** Delete given budget from database; returns undefined. */

static async remove(user_id, budget_id) {
  let result = await db.query(`
    DELETE
    FROM budgets
    WHERE id = $1
    AND user_id = $2
    RETURNING id`,
    [budget_id, user_id]
  )
  const budget = result.rows[0];
  if (!budget) throw new NotFoundError(`No budget id: ${budget_id}`);
}

}

module.exports = Budget;