const User = require("./user");
const db = require("../db");
const { UnauthorizedError, BadRequestError, NotFoundError } = require("../expressErrors");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  userIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */
describe("authenticate", () => {
  test("works", async () => {
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      id: expect.any(Number),
      username: "u1",
      first_name: "U1F",
      last_name: "U1L",
      email: "u1@email.com"
    });
  });

  test("UnauthorizedError if no such user", async () => {
    try {
      await User.authenticate("nope", "password1");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("UnauthorizedError if wrong password", async function () {
    try {
      await User.authenticate("u1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});


/************************************** register */
describe("register", () => {
  const newUser = {
    username: "new",
    firstName: "Test",
    lastName: "User",
    email: "test@test.com",
  };

  test("works", async () => {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual({id: expect.any(Number), ...newUser});
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("BadRequestError with duplicate data", async () => {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */
describe("findAll", () => {
  test("works", async () => {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        id: expect.any(Number),
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com"
      },
      {
        id: expect.any(Number),
        username: "u2",
        firstName: "U2F",
        lastName: "U2L",
        email: "u2@email.com"
      }
    ])
  });
});

/************************************** get */
describe("get", () => {
  test("works", async () => {
    let user = await User.get(userIds[0]);
    expect(user).toEqual({
      id: userIds[0],
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com"
    })
  });

  test("NotFoundError if user not found", async () => {
    try {
      await User.get(12345);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */
describe("update", () => {
  const updateData = {
    username: "updateu1",
    firstName: "updateU1F",
    lastName: "updateU1L",
    email: "update@email.com"
  }

  test("works", async () => {
    let user = await User.update(userIds[0], 'password1', updateData);
    expect(user).toEqual({
      id: userIds[0],
      ...updateData
    })
  });

  test("works for partial update", async () => {
    let user = await User.update(userIds[0], 'password1', {email: "update@email.com"});
    expect(user).toEqual({
      id: userIds[0],
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "update@email.com"
    })
  });

  test("NotFoundError if user not found", async () => {
    try {
      await User.update(123, 'password1', updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("UnauthorizedError if incorrect password", async () => {
    try {
      await User.update(userIds[0], 'wrongpassword', updateData);
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** remove */
describe("remove", () => {
  test("works", async () => {
    await User.remove(userIds[0]);
    const res = await db.query(
        `SELECT * FROM users WHERE id=${userIds[0]}`);
    expect(res.rows.length).toEqual(0);
  });

  test("NotFoundError if user not found", async () => {
    try {
      await User.remove(1234);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});