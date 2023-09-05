require('dotenv').config();
process.env.NODE_ENV = 'test';
const bcrypt = require("bcrypt");
const db = require("../db");
const BCRYPT_WORK_FACTOR = 1;

const userIds = [];

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  // await db.query(`
  //   INSERT INTO companies(handle, name, num_employees, description, logo_url)
  //   VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
  //          ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
  //          ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

  // const resultsJobs = await db.query(`
  //   INSERT INTO jobs (title, salary, equity, company_handle)
  //   VALUES ('Job1', 100, '0.1', 'c1'),
  //          ('Job2', 200, '0.2', 'c1'),
  //          ('Job3', 300, '0', 'c1'),
  //          ('Job4', NULL, NULL, 'c1')
  //   RETURNING id`);
  // testJobIds.splice(0, 0, ...resultsJobs.rows.map(r => r.id));

  const userResult = await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING id, username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);
  userIds.splice(0, 0, ...userResult.rows.map(u => u.id));
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
  userIds
};