const request = require("supertest");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  userIds,
  userTokens,
  expenseIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/*********************************** GET /users/:userId/expenses/:expenseId */
describe("GET /users/:userId/expenses/:expenseId", () => {
  test("works", async () => {
    const resp = await request(app)
        .get(`/users/${userIds[0]}/expenses/${expenseIds[0]}`)
        .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.body).toEqual(
      { expense: {
        id: expenseIds[0],
        amount: "100.00",
        date: "2023-08-01T07:00:00.000Z",
        vendor: "testVendor",
        description: null,
        category_id: 1,
        category: "Entertainment",
        user_id: userIds[0], 
        transaction_id: "abc"
      }
    })
  });

  test("404 NotFound if expense not found", async () => {
    const resp = await request(app)
        .get(`/users/${userIds[0]}/expenses/54321`)
        .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("401 Unauthorized if incorrect user/token", async () => {
    const resp = await request(app)
        .get(`/users/${userIds[0]}/expenses/${expenseIds[0]}`)
        .set("Authorization", `Bearer ${userTokens[1]}`);
    expect(resp.statusCode).toEqual(401);
  });
});
 
/*********************************** GET /users/:userId/expenses */
describe("GET /users/:userId/expenses", () => {
  test("works", async () => {
    const resp = await request(app)
        .get(`/users/${userIds[0]}/expenses`)
        .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.body).toEqual(
      { expenses: [{
        id: expenseIds[1],
        amount: "200.00",
        date: "2023-08-02T07:00:00.000Z",
        vendor: "testVendor2",
        description: null,
        category_id: 2,
        category: "Food & Drink",
        transaction_id: null
      }, {
        id: expenseIds[0],
        amount: "100.00",
        date: "2023-08-01T07:00:00.000Z",
        vendor: "testVendor",
        description: null,
        category_id: 1,
        category: "Entertainment",
        transaction_id: "abc"
      }]
    })
  });

  test("401 Unauthorized if incorrect user/token", async () => {
    const resp = await request(app)
      .get(`/users/${userIds[1]}/expenses`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/*********************************** POST /users/:userId/expenses */
describe("POST /users/:userId/expenses", () => {
  test("works", async () => {
    const resp = await request(app)
        .post(`/users/${userIds[0]}/expenses`)
        .set("Authorization", `Bearer ${userTokens[0]}`)
        .send({
          amount: 600,
          date: "08/06/2023",
          vendor: "testVendor6",
          category_id: 6
        });
    expect(resp.body).toEqual({
      expense: {
        id: expect.any(Number),
        amount: 600,
        date: "2023-08-06T07:00:00.000Z",
        vendor: "testVendor6",
        description: null,
        category_id: 6,
        category: "Travel",
        transaction_id: null
      }
    });
  });

  test("401 Unauthorized if incorrect user/token", async () => {
    const resp = await request(app)
      .post(`/users/${userIds[1]}/expenses`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        amount: 600,
        date: "08/06/2023",
        vendor: "testVendor6",
        category_id: 6
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("400 BadRequest if incomplete data", async () => {
    const resp = await request(app)
      .post(`/users/${userIds[0]}/expenses`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        date: "08/06/2023",
        vendor: "testVendor6",
        category_id: 6
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("400 BadRequest if duplicate transaction_id", async () => {
    const resp = await request(app)
      .post(`/users/${userIds[0]}/expenses`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        amount: 600,
        date: "08/06/2023",
        vendor: "testVendor6",
        category_id: 6,
        transaction_id: 'abc'
      });
    expect(resp.statusCode).toEqual(400);
  });
});

/*********************************** PATCH /users/:userId/expenses/:expenseId */
describe("PATCH /users/:userId/expenses/:expenseId", () => {
  test("works", async () => {
    const resp = await request(app)
      .patch(`/users/${userIds[0]}/expenses/${expenseIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        amount: 600,
        date: "08/06/2023",
        vendor: "testVendor6",
        category_id: 6,
        description: "update"
      });
    expect(resp.body).toEqual({
      expense: {
        id: expect.any(Number),
        amount: "600.00",
        date: "2023-08-06T07:00:00.000Z",
        vendor: "testVendor6",
        description: "update",
        category_id: 6
      }
    });
  });

  test("works for partial update", async () => {
    const resp = await request(app)
      .patch(`/users/${userIds[0]}/expenses/${expenseIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        amount: 600,
        date: "08/06/2023",
      });
    expect(resp.body).toEqual({
      expense: {
        id: expect.any(Number),
        amount: "600.00",
        date: "2023-08-06T07:00:00.000Z",
        vendor: "testVendor",
        description: null,
        category_id: 1
      }
    });
  });

  test("401 Unauthorized if incorrect user/token", async () => {
    const resp = await request(app)
      .patch(`/users/${userIds[1]}/expenses/${expenseIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        amount: 600,
        date: "08/06/2023",
        vendor: "testVendor6",
        category_id: 6,
        description: "update"
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("400 BadRequest if invalid data", async () => {
    const resp = await request(app)
      .patch(`/users/${userIds[0]}/expenses/${expenseIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        amount: 600,
        date: "08/06/2023",
        vendor: "testVendor6",
        category_id: "test"
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("400 BadRequest if expense not found", async () => {
    const resp = await request(app)
      .patch(`/users/${userIds[0]}/expenses/12345`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        amount: 600,
        date: "08/06/2023",
        vendor: "testVendor6",
        category_id: "test"
      });
    expect(resp.statusCode).toEqual(400);
  });
});

/********************************** DELETE /users/:userId/expenses/:expenseId */
describe("DELETE /users/:userId/expenses/:expenseId", () => {
  test("works", async () => {
    const resp = await request(app)
      .delete(`/users/${userIds[0]}/expenses/${expenseIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.body).toEqual(
      { deleted: `${expenseIds[0]}` });
  });

  test("401 Unauthorized if incorrect user/wrong token", async () => {
    const resp = await request(app)
      .delete(`/users/${userIds[1]}/expenses/${expenseIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("404 NotFound if expense not found", async () => {
    const resp = await request(app)
      .delete(`/users/${userIds[0]}/expenses/1234`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.statusCode).toEqual(404);
  });
});