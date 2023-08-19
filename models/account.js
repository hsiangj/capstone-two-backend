const db = require("../db");

const { BadRequestError } = require("../expressErrors");

class Account {

/** Create an account from Plaid data.
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
    RETURNING institution_name`,
    [user_id, access_token, item_id, account_id, institution_id, institution_name, account_type])
    
  const account = result.rows[0];
  return account;
}



}

module.exports = Account;