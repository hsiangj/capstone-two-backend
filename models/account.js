const db = require("../db");

const { BadRequestError, NotFoundError } = require("../expressErrors");

class Account {

/** Find all accounts for a single user based on user id.
    Returns [{ id, amount, date, vendor, description, category_id, category, transaction_id }, ...]
*/

static async getAll(user_id) {
  const result = await db.query(`
    SELECT id, access_token, item_id, account_id, institution_name, account_type 
    FROM accounts e
    WHERE user_id = $1
    ORDER BY institution_name`,
    [user_id]
  );

  return result.rows;
}

/** Create an account from Plaid data. See plaid route.
    Data should be { userID, accessToken, itemID, accountID, institutionID, institutionName, accountType } 
    Returns { institution name } 
    Throws BadRequestError for duplicate account.
*/

static async create({ user_id, access_token, item_id, account_id, institution_id, institution_name, account_type }) {
  const duplicateCheck = await db.query(`
    SELECT user_id, account_id 
    FROM accounts
    WHERE user_id = $1 
    AND account_id = $2`,
    [user_id, account_id])
  
  if (duplicateCheck.rows[0]) throw new BadRequestError('Account already exists');

  const result = await db.query(`
    INSERT INTO accounts
    (user_id, access_token, item_id, account_id, institution_id, institution_name, account_type)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, institution_name`,
    [user_id, access_token, item_id, account_id, institution_id, institution_name, account_type])
    
  const account = result.rows[0];
  return account;
}

/** Delete given account from database; returns undefined. */

static async remove(id) {
  let result = await db.query(`
    DELETE
    FROM accounts
    WHERE id = $1
    RETURNING id`,
    [id]
  )
  const expense = result.rows[0];
  if (!expense) throw new NotFoundError(`No account id: ${id}`);
 }

}

module.exports = Account;