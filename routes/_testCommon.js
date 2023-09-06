require('dotenv').config();
process.env.NODE_ENV = 'test';
const db = require("../db");
const User = require("../models/user");
const Expense = require("../models/expense");
const Budget = require("../models/budget");
const { createToken } = require("../helpers/token");

const userIds = [];
const userTokens = [];
const expenseIds = [];
const budgetIds = [];

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM expenses");
  await db.query("DELETE FROM accounts");
  
  const user1Result = await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1"
  });
  
  userIds[0] = user1Result.id;
  userTokens[0] = createToken({ username: "u1", id: userIds[0] });

  const user2Result = await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2"
  });
  
  userIds[1] = user2Result.id;
  userTokens[1] = createToken({ username: "u2", id: userIds[1] });

  const expense1Result = await Expense.create(userIds[0], {
    amount: 100,
    date: '08/01/2023',
    vendor: 'testVendor',
    category_id: 1,
    transaction_id: 'abc'
  });
  const expense2Result = await Expense.create(userIds[0], {
    amount: 200,
    date: '08/02/2023',
    vendor: 'testVendor2',
    category_id: 2
  });
  expenseIds[0] = expense1Result.id;
  expenseIds[1] = expense2Result.id;

  const budget1Result = await Budget.create(userIds[0], {
    amount: 500,
    category_id: 1
  });
  const budget2Result = await Budget.create(userIds[0], {
    amount: 1000,
    category_id: 2
  });
  budgetIds[0] = budget1Result.budget_id; 
  budgetIds[1] = budget2Result.budget_id;
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
  userTokens,
  expenseIds,
  budgetIds
};