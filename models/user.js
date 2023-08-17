const db = require("../db");
const bcrypt = require("bcrypt");
const { UnauthorizedError, BadRequestError, NotFoundError } = require("../expressErrors");
const { partialUpdateSql } = require("../helpers/sql")
const BCRYPT_WORK_FACTOR = +process.env.BCRYPT_WORK_FACTOR;

class User {

  /** Authenticate user with username and password. 
      Returns {id, username, first_name, last_name, email} 
      Throws UnauthorizedError if user not found or wrong credentials.
  */
  static async authenticate(username, password) {
    // find user
    const result = await db.query(`
      SELECT id, username, password, first_name, last_name, email
      FROM users
      WHERE username = $1`, 
      [username]
    );

    const user = result.rows[0];

    // if user is found, compare hashed password from db to new hash from password passed in
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError('Invalid username/password');
  }

  /** Register user with data. 
      Returns {id, username, first_name, last_name, email} 
      Throws BadRequestError on duplicate username.
  */
  static async register({ username, password, firstName, lastName, email }) {
    const duplicateCheck = await db.query(`
      SELECT username
      FROM users
      WHERE username = $1`,
      [username]
    );
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }
  
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(`
      INSERT INTO users
        (username, password, first_name, last_name, email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email`,
      [username, hashedPassword, firstName, lastName, email]
    )
    
    const user = result.rows[0];

    return user;
  }

  /** Find all users.
      Returns [{ id, username, first_name, last_name, email }, ...]
  */
  static async findAll() {
    const result = await db.query(`
      SELECT id, username, first_name AS "firstName", last_name AS "lastName", email
      FROM users
      ORDER BY username`
    );

    return result.rows;
  }

  /** Given user id, return data about user.
      Returns { id, username, first_name, last_name, email } 
      where budgets is { id, amount, category }
      and expenses is { id, amount. date, vendor, description, category }

      Throws NotFoundError if user not found.
  */
  static async get(id) {
    const userRes = await db.query(`
      SELECT id, username, first_name AS "firstName", last_name AS "lastName", email
      FROM users
      WHERE id = $1`,
      [id]
    )

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user id: ${id}`);

    const budgetRes = await db.query(`
      SELECT b.id, amount, category
      FROM budgets AS b
      JOIN categories as c
      ON b.category_id = c.id 
      WHERE user_id = $1`,
      [id])

    user.budgets = budgetRes.rows;

    const expenseRes = await db.query(`
      SELECT e.id, amount, date, vendor, description, category
      FROM expenses AS e
      JOIN categories as c
      ON e.category_id = c.id 
      WHERE user_id = $1`,
      [id])
    
    user.expenses = expenseRes.rows;
    
    return user;
  } 

  /** Update user data.
      Allows for partial update, data can include:
       { firstName, lastName, username, email }
      Requires user password to confirm changes. 
      Returns {id, username, first_name, last_name, email} 
      Throws NotFoundError if user not found, and UnauthorizedError if incorrect password is entered.
  */
  static async update(id, password, data) {
    const isCorrectUser = await db.query(`
      SELECT id, password
      FROM users
      WHERE id = $1`,
      [id]
    ) 
    if(!isCorrectUser) throw new NotFoundError(`No user id: ${id}`);
    
    const isCorrectPassword = await bcrypt.compare(password, isCorrectUser.rows[0].password)
    
    if(!isCorrectPassword) throw new UnauthorizedError('Invalid password');

    const { setCols, values } = partialUpdateSql(
      data, 
      {
      firstName: "first_name",
      lastName: "last_name"
      });
      
      const idPosition = "$" + (values.length+1);

      const sqlQuery = `
        UPDATE users 
        SET ${setCols} 
        WHERE id = ${idPosition} 
        RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email`;
      const result = await db.query(sqlQuery, [...values, id]);
      const user = result.rows[0];

      return user;
  }

  
  /** Delete given user from database; returns username. */
  static async remove(id) {
    let result = await db.query(`
      DELETE
      FROM users
      WHERE id = $1
      RETURNING username`,
      [id]
    )
    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user id: ${id}`);

    return user.username;
   }

}

module.exports = User;