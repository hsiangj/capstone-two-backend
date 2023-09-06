const request = require("supertest");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  userIds,
  userTokens,
  budgetIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/*********************************** GET /users/:userId/budgets/:budgetId */
describe("GET /users/:userId/budgets/:budgetId", () => {
  test("works", async () => {
    const resp = await request(app)
        .get(`/users/${userIds[0]}/budgets/${budgetIds[0]}`)
        .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.body).toEqual(
      { budget: {
        id: budgetIds[0],
        amount: 500,
        category_id: 1,
        category: "Entertainment",
        user_id: userIds[0]
      }
    })
  });

  test("401 Unauthorized if incorrect user/token", async () => {
    const resp = await request(app)
      .get(`/users/${userIds[1]}/budgets/${budgetIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("404 NotFound if budget not found", async () => {
    const resp = await request(app)
      .get(`/users/${userIds[0]}/budgets/13579`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.statusCode).toEqual(404);
  });
});
 
/*********************************** GET /users/:userId/budgets */
describe("GET /users/:userId/budgets", () => {
  test("works", async () => {
    const resp = await request(app)
      .get(`/users/${userIds[0]}/budgets`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.body).toEqual(
      { budgets: [{
        budget_id: budgetIds[0],
        amount: "500.00",
        category_id: 1,
        category: "Entertainment",
      },{
        budget_id: budgetIds[1],
        amount: "1000.00",
        category_id: 2,
        category: "Food & Drink",
      },{
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
    ]})
  });

  test("401 Unauthorized if incorrect user/token", async () => {
    const resp = await request(app)
      .get(`/users/${userIds[1]}/budgets`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/*********************************** POST /users/:userId/budgets */
describe("POST /users/:userId/budgets", () => {
  test("works", async () => {
    const resp = await request(app)
        .post(`/users/${userIds[0]}/budgets`)
        .set("Authorization", `Bearer ${userTokens[0]}`)
        .send({
          amount: 600,
          category_id: 6
        });
    expect(resp.body).toEqual({
      budget: {
        budget_id: expect.any(Number),
        amount: 600,
        category_id: 6,
        category: "Travel"
      }
    });
  });

  test("401 Unauthorized if incorrect user/token", async () => {
    const resp = await request(app)
      .post(`/users/${userIds[1]}/budgets`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        amount: 600,
        category_id: 6
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("400 BadRequest if incorrect user/token", async () => {
    const resp = await request(app)
      .post(`/users/${userIds[0]}/budgets`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        amount: 600
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("400 BadRequest if duplicate budget for category", async () => {
    const resp = await request(app)
      .post(`/users/${userIds[0]}/budgets`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        amount: 600,
        category_id: 1
      });
    expect(resp.statusCode).toEqual(400);
  });
});

/*********************************** PATCH /users/:userId/budgets/:budgetId */
describe("PATCH /users/:userId/budgets/:budgetId", () => {
  test("works", async () => {
    const resp = await request(app)
      .patch(`/users/${userIds[0]}/budgets/${budgetIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        amount: 600
      });
    expect(resp.body).toEqual({
      budget: {
        budget_id: budgetIds[0],
        amount: 600,
        category_id: 1
      }
    });
  });

  test("401 Unauthorized if incorrect user/token", async () => {
    const resp = await request(app)
      .patch(`/users/${userIds[1]}/budgets/${budgetIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        amount: 600
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("400 BadRequest if invalid data: negative amount", async () => {
    const resp = await request(app)
      .patch(`/users/${userIds[0]}/budgets/${budgetIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        amount: -600
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("400 BadRequest if invalid data: category_id", async () => {
    const resp = await request(app)
      .patch(`/users/${userIds[0]}/budgets/${budgetIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        category_id: 5
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("404 NotFound if budget not found", async () => {
    const resp = await request(app)
      .patch(`/users/${userIds[0]}/budgets/12345`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        amount: 600
      });
    expect(resp.statusCode).toEqual(404);
  });
});

/********************************** DELETE /users/:userId/budgets/:budgetId */
describe("DELETE /users/:userId/budgets/:budgetId", () => {
  test("works", async () => {
    const resp = await request(app)
      .delete(`/users/${userIds[0]}/budgets/${budgetIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.body).toEqual(
      { deleted: `${budgetIds[0]}` });
  });

  test("401 Unauthorized if incorrect user/wrong token", async () => {
    const resp = await request(app)
      .delete(`/users/${userIds[1]}/budgets/${budgetIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("404 NotFound if budget not found", async () => {
    const resp = await request(app)
      .delete(`/users/${userIds[0]}/budgets/12345`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.statusCode).toEqual(404);
  });
});