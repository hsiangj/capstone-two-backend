const request = require("supertest");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  userIds,
  userTokens,
  accountIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/*********************************** GET /users/:userId/accounts */
describe("GET /users/:userId/accounts", () => {
  test("works", async () => {
    const resp = await request(app)
      .get(`/users/${userIds[0]}/accounts`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.body).toEqual(
      { accounts: [
        { id: accountIds[0],
          access_token: "accToken1",
          item_id: "item1",
          account_id: "account1",
          institution_name: "abc bank",
          account_type: "abc checking"
        },{
          id: accountIds[1],
          access_token: "accToken2",
          item_id: "item2",
          account_id: "account2",
          institution_name: "xyz bank",
          account_type: "xyz checking"
        }
    ]})
  });

  test("401 Unauthorized if incorrect user/token", async () => {
    const resp = await request(app)
      .get(`/users/${userIds[1]}/accounts`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/********************************* DELETE /users/:userId//accounts/:accountId */
describe("DELETE /users/:userId/budgets/:budgetId", () => {
  test("works", async () => {
    const resp = await request(app)
      .delete(`/users/${userIds[0]}/accounts/${accountIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.body).toEqual(
      { deleted: `${accountIds[0]}` });
  });

  test("401 Unauthorized if incorrect user/wrong token", async () => {
    const resp = await request(app)
      .delete(`/users/${userIds[1]}/accounts/${accountIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("404 NotFound if budget not found", async () => {
    const resp = await request(app)
      .delete(`/users/${userIds[0]}/accounts/12345`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.statusCode).toEqual(404);
  });
});