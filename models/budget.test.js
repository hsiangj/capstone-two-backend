const Budget = require("./budget");
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressErrors");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  userIds,
  budgetIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** get */
describe("get", () => {
  test("works", async () => {
    let budget = await Budget.get(userIds[0], budgetIds[0]);
    expect(budget).toEqual({
      id: budgetIds[0],
			amount: 500,
			category_id: 1,
			category: "Entertainment",
      user_id: userIds[0]
    })
  });
 
  test("NotFoundError if budget not found", async () => {
    try {
      await Budget.get(userIds[0], 12345);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** findAll */
describe("getAll", () => {
  test("works", async () => {
    const budgets = await Budget.getAll(userIds[0]);
    expect(budgets).toEqual([
      {
        budget_id: budgetIds[0],
        amount: "500.00",
        category_id: 1,
        category: "Entertainment"
      },
      {
        budget_id: budgetIds[1],
        amount: "1000.00",
        category_id: 2,
        category: "Food & Drink"
      },
      {
        amount: null,
        budget_id: null,
        category: "Medical",
        category_id: 3
      },
      {
        amount: null,
        budget_id: null,
        category: "Rent & utilities",
        category_id: 4
      },
      {
        amount: null,
        budget_id: null,
        category: "Transportation",
        category_id: 5
      },
      {
        amount: null,
        budget_id: null,
        category: "Travel",
        category_id: 6
      },
      {
        amount: null,
        budget_id: null,
        category: "Other",
        category_id: 7
      }
    ])
  });
});

/************************************** create */
describe("create", () => {
  const newData = {
    amount: 300,
    category_id: 6
  }
  test("works", async () => {
    const budget = await Budget.create(userIds[0], newData);
    expect(budget).toEqual(
      {
        budget_id: expect.any(Number),
        ...newData,
       category: "Travel"
      }
    )
  });

  test("BadRequestError if category_id exists for user", async () => {
    try {
      await Budget.create(userIds[0], {
        amount: 300,
        category_id: 1
      });
      fail();
    } catch(err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** update */
describe("update", () => {
  test("works", async () => {
    let budget = await Budget.update(userIds[0], budgetIds[0], 50);
    expect(budget).toEqual({
      budget_id: budgetIds[0],
      amount: 50,
      category_id: 1
    })
  });

  test("NotFoundError if budget not found", async () => {
    try {
      await Budget.update(userIds[0], 1234, 50);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** remove */
describe("remove", () => {
  test("works", async () => {
    await Budget.remove(userIds[0], budgetIds[0]);
    const res = await db.query(
        `SELECT * FROM budgets WHERE id=${budgetIds[0]}`);
    expect(res.rows.length).toEqual(0);
  });

  test("NotFoundError if budget not found", async () => {
    try {
      await Budget.remove(userIds[0], 1234);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});