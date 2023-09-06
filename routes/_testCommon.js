require('dotenv').config();
process.env.NODE_ENV = 'test';
const db = require("../db");
const User = require("../models/user");
const { createToken } = require("../helpers/token");

const userIds = [];
const userTokens = [];

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
  userTokens
};