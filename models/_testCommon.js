require('dotenv').config();
process.env.NODE_ENV = 'test';
const bcrypt = require("bcrypt");
const db = require("../db");
const BCRYPT_WORK_FACTOR = 1;

const userIds = [];
const expenseIds = [];
const budgetIds = [];
const accountIds = [];

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM expenses");
  await db.query("DELETE FROM accounts");
  
  const userResult = await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING id`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);
  userIds.splice(0, 0, ...userResult.rows.map(u => u.id));

  const expenseResult = await db.query(`
        INSERT INTO expenses (user_id, 
                            amount,
                            date,
                            vendor,
                            category_id)
        VALUES ($1, 100, '08/01/2023', 'testVendor', 1),
              ($1, 200, '08/02/2023', 'testVendor2', 2)
        RETURNING id`, [userIds[0]]);
  expenseIds.splice(0, 0, ...expenseResult.rows.map(e => e.id));   
  
  const budgetResult = await db.query(`
        INSERT INTO budgets (user_id, 
                            amount,
                            category_id)
        VALUES ($1, 500, 1),
              ($1, 1000, 2)
        RETURNING id`, [userIds[0]]);
  budgetIds.splice(0, 0, ...budgetResult.rows.map(b => b.id));  
  
  const accountResult = await db.query(`
        INSERT INTO accounts (user_id, 
                            access_token,
                            item_id,
                            account_id,
                            institution_name)
        VALUES ($1, 'testAccessToken', 'testItem', 'testAccountId', 'abc'),
              ($1, 'testAccessToken2', 'testItem2', 'testAccountId2', 'efg')
        RETURNING id`, [userIds[0]]);
  accountIds.splice(0, 0, ...accountResult.rows.map(a => a.id));  
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  userIds,
  expenseIds,
  budgetIds,
  accountIds
};