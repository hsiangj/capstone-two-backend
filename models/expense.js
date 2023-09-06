const db = require("../db");

const { BadRequestError, NotFoundError } = require("../expressErrors");
const { partialUpdateSql } = require("../helpers/sql");

class Expense {

/** Given expense id, return data about expense for a specific user.
    Returns { id, amount, date, vendor, description, category_id, category, user_id, transaction_id } 

    Throws NotFoundError if expense not found.
*/

static async get(user_id, expense_id) {
  const result = await db.query(`
    SELECT e.id, amount, date, vendor, description, category_id, category, user_id, transaction_id
    FROM expenses e
    JOIN categories c
    ON e.category_id = c.id
    WHERE e.id = $1
    AND user_id = $2`,
    [expense_id, user_id])

  const expense = result.rows[0];

  if (!expense) throw new NotFoundError(`No expense id: ${expense_id}`);

  return expense;
}

/** Find all expenses for a single user based on user id.
    Returns [{ id, amount, date, vendor, description, category_id, category, transaction_id }, ...]
*/

static async findAll(user_id) {
  const result = await db.query(`
    SELECT e.id, amount, date, vendor, description, category_id, category, transaction_id 
    FROM expenses e
    JOIN categories c
    ON e.category_id = c.id
    WHERE user_id = $1
    ORDER BY date DESC`,
    [user_id]
  );
  
  return result.rows;
}

/** Create an expense from data.
    Data should be { amount, date, vendor, description, category_id, transaction_id } with amount, date, category_id and vendor being required.
    Returns { id, amount, date, vendor, description, category_id, user_id, transaction_id } 
*/

static async create(user_id, { amount, date, vendor, description=null, category_id=7, transaction_id=null, account_id=null}) {
  if (transaction_id) {
    const duplicateCheck = await db.query(`
      SELECT transaction_id 
      FROM expenses 
      WHERE transaction_id = $1`,
      [transaction_id])
    
    if (duplicateCheck.rows[0]) 
      throw new BadRequestError(`Duplicate expense: ${transaction_id}`)  
  }
  const result = await db.query(`
    INSERT INTO expenses
    (amount, date, vendor, description, category_id, user_id, transaction_id, account_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, amount, date, vendor, description, category_id,transaction_id, 
    (SELECT category FROM categories WHERE id = $5)`,
    [amount, date, vendor, description, category_id, user_id, transaction_id, account_id]
  )
  const expense = result.rows[0];
  expense.amount = parseFloat(expense.amount);

  return expense;
}

/** Update expense data.
    Allows for partial update, data can include:
      { amount, date, vendor, description, category_id }
    Returns { id, amount, date, vendor, description, category_id } 
    Throws NotFoundError if expense not found.
*/

static async update(user_id, expense_id, data) {
  const { setCols, values } = partialUpdateSql(
    data, 
    {});
    
  const expIdPosition = "$" + (values.length+1);
  const userIdPosition = "$" + (values.length+2);

  const sqlQuery = `
    UPDATE expenses 
    SET ${setCols} 
    WHERE id = ${expIdPosition} 
    AND user_id = ${userIdPosition}
    RETURNING id, amount, date, vendor, description, category_id`;

  const result = await db.query(sqlQuery, [...values, expense_id, user_id]);
  const expense = result.rows[0];

  if (!expense) throw new NotFoundError(`No expense id: ${expense_id}`)

  return expense;
}

/** Delete given expense from database; returns undefined. */

static async remove(user_id, expense_id) {
  let result = await db.query(`
    DELETE
    FROM expenses
    WHERE id = $1
    AND user_id = $2
    RETURNING id`,
    [expense_id, user_id]
  )
  const expense = result.rows[0];
  if (!expense) throw new NotFoundError(`No expense id: ${expense_id}`);
 }

}

module.exports = Expense;