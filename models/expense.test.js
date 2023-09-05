const Expense = require("./expense");
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressErrors");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  userIds,
  expenseIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** get */
describe("get", () => {
  test("works", async () => {
    let expense = await Expense.get(userIds[0], expenseIds[0]);
    expect(expense).toEqual({
      id: expenseIds[0],
			amount: "100.00",
			date: new Date("2023-08-01T07:00:00.000Z"),
			vendor: "testVendor",
			description: null,
			category_id: 1,
			category: "Entertainment",
			transaction_id: null,
      user_id: userIds[0]
    })
  });
 
  test("NotFoundError if expense not found", async () => {
    try {
      await Expense.get(userIds[0], 12345);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** findAll */
describe("findAll", () => {
  test("works", async () => {
    const expenses = await Expense.findAll(userIds[0]);
    expect(expenses).toEqual([
      {
        id: expenseIds[1],
        amount: "200.00",
        date: new Date("2023-08-02T07:00:00.000Z"),
        vendor: "testVendor2",
        description: null,
        category_id: 2,
        category: "Food & Drink",
        transaction_id: null
      },
      {
        id: expenseIds[0],
        amount: "100.00",
        date: new Date("2023-08-01T07:00:00.000Z"),
        vendor: "testVendor",
        description: null,
        category_id: 1,
        category: "Entertainment",
        transaction_id: null
      }
    ])
  });
});

/************************************** create */
describe("create", () => {
  const newData = {
    amount: 300,
    date: "08/03/2023",
    vendor: "newVendor",
    category_id: 6,
    transaction_id: 'abc'
  }
  test("works", async () => {
    const expense = await Expense.create(userIds[0], newData);
    expect(expense).toEqual(
      {
        id: expect.any(Number),
        ...newData,
        date: new Date("2023-08-03T07:00:00.000Z"),
        description: null,
        transaction_id: 'abc',
        category: "Travel"
      }
    )
  });

  test("BadRequestError if duplicate transacion_id", async () => {
    try {
      await Expense.create(userIds[0], newData);
      await Expense.create(userIds[0], newData);
      fail();
    } catch(err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** update */
describe("update", () => {
  const updateData = {
    amount: "500.00",
    date: new Date("2023-08-05T07:00:00.000Z"),
    vendor: "testVendor5",
    description: "test",
    category_id: 5,
  }

  test("works", async () => {
    let expense = await Expense.update(userIds[0], expenseIds[1], updateData);
    expect(expense).toEqual({
      id: expenseIds[1],
      ...updateData
    })
  });

  test("works for partial update", async () => {
    let expense = await Expense.update(userIds[0], expenseIds[1], {amount: "50"});
    expect(expense).toEqual({
      id: expenseIds[1],
      amount: "50.00",
      date: new Date("2023-08-02T07:00:00.000Z"),
      vendor: "testVendor2",
      description: null,
      category_id: 2
    })
  });

  test("NotFoundError if expense not found", async () => {
    try {
      await Expense.update(userIds[0], 1234, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** remove */
describe("remove", () => {
  test("works", async () => {
    await Expense.remove(userIds[0], expenseIds[0]);
    const res = await db.query(
        `SELECT * FROM expenses WHERE id=${expenseIds[0]}`);
    expect(res.rows.length).toEqual(0);
  });

  test("NotFoundError if expense not found", async () => {
    try {
      await Expense.remove(userIds[0], 1234);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});