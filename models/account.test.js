const Account = require("./account");
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressErrors");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  userIds,
  accountIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** findAll */
describe("getAll", () => {
  test("works", async () => {
    const accounts = await Account.getAll(userIds[0]);
    expect(accounts).toEqual([
      {
        id: accountIds[0],
        access_token: "testAccessToken",
        item_id: "testItem",
        account_id: "testAccountId",
        institution_name: "abc",
        account_type: null
      },
      {
        id: accountIds[1],
        access_token: "testAccessToken2",
        item_id: "testItem2",
        account_id: "testAccountId2",
        institution_name: "efg",
        account_type: null
      }
    ])
  });
});

/************************************** create */
describe("create", () => {
  const newData = {
    access_token: "testAccessToken3",
    item_id: "testItem3",
    account_id: "testAccountId3",
    institution_id: "test",
    institution_name: "abc",
    account_type: null
  }
  test("works", async () => {
    const account = await Account.create({...newData, user_id: userIds[0]});
    expect(account).toEqual(
      {
       id: expect.any(Number),
       institution_name: "abc"
      }
    )
  });

  test("BadRequestError if account_id exists for user", async () => {
    try {
      await Account.create({...newData, user_id: userIds[0], account_id: 'testAccountId'});
    
      fail();
    } catch(err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */
describe("remove", () => {
  test("works", async () => {
    await Account.remove(accountIds[0]);
    const res = await db.query(
        `SELECT * FROM accounts WHERE id=${accountIds[0]}`);
    expect(res.rows.length).toEqual(0);
  });

  test("NotFoundError if account not found", async () => {
    try {
      await Account.remove(1234);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});