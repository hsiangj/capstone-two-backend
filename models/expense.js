const db = require("../db");

const { BadRequestError, NotFoundError } = require("../expressErrors");
const { partialUpdateSql } = require("../helpers/sql");

class Expense {

/** Given expense id, return data about expense.
    Returns { id, amount, date, vendor, description, category_id, user_id, transaction_id } 

    Throws NotFoundError if expense not found.
*/
static async get(id) {
  const result = await db.query(`
    SELECT id, amount, date, vendor, description, category_id, user_id, transaction_id
    FROM expenses 
    WHERE id = $1`,
    [id])

  const expense = result.rows[0];

  if (!expense) throw new NotFoundError(`No expense id: ${id}`);

  return expense;
}

/** Find all expenses for a single user based on user id.
    Returns [{ id, amount, date, vendor, description, category_id, transaction_id }, ...]
*/

static async findAll({ user_id }) {
  console.log('hello from expnese model', user_id)
  const result = await db.query(`
    SELECT id, amount, date, vendor, description, category_id, transaction_id 
    FROM expenses
    WHERE user_id = $1
    ORDER BY date`,
    [user_id]
  );

  return result.rows;
}

/** Create an expense from data.
    Data should be { amount, date, vendor, description, category_id, user_id, transaction_id } 
    Returns { id, amount, date, vendor, description, category_id, user_id, transaction_id } 

*/

static async create({ amount, date, vendor, description=null, category_id, user_id, transaction_id=null }) {
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
    (amount, date, vendor, description, category_id, user_id, transaction_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, amount, date, vendor, description, category_id, user_id, transaction_id`,
    [amount, date, vendor, description, category_id, user_id, transaction_id]
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

static async update(id, data) {
  const { setCols, values } = partialUpdateSql(
    data, 
    {});
    
  const idPosition = "$" + (values.length+1);

  const sqlQuery = `
    UPDATE expenses 
    SET ${setCols} 
    WHERE id = ${idPosition} 
    RETURNING id, amount, date, vendor, description, category_id`;

  const result = await db.query(sqlQuery, [...values, id]);
  const expense = result.rows[0];

  if (!expense) throw new NotFoundError(`No expense id: ${id}`)

  return expense;
}

/** Delete given transaction from database; returns undefined. */

static async remove(id) {
  let result = await db.query(`
    DELETE
    FROM expenses
    WHERE id = $1
    RETURNING id`,
    [id]
  )
  const expense = result.rows[0];
  if (!expense) throw new NotFoundError(`No expense id: ${id}`);
 }

}

module.exports = Expense;