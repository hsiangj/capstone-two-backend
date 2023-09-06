const request = require("supertest");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  userIds,
  userTokens
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /users/:userId */
describe("GET /users/:userId", () => {
  test("works", async () => {
    const resp = await request(app)
        .get(`/users/${userIds[0]}`)
        .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.body).toEqual(
      { user: {
        id: userIds[0],
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com"
      }
    })
  });

  test("401 Unauthorized if incorrect user", async () => {
    const resp = await request(app)
        .get(`/users/12345`)
        .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("401 Unauthorized if wrong token", async () => {
    const resp = await request(app)
        .get(`/users/${userIds[0]}`)
        .set("Authorization", `Bearer ${userTokens[1]}`);;
    expect(resp.statusCode).toEqual(401);
  });
});
 
/************************************** PATCH /users/:userId */
describe("PATCH /users/:userId", () => {
  test("works", async () => {
    const resp = await request(app)
      .patch(`/users/${userIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        username: "u1update",
        firstName: "U1Fupdate",
        lastName: "U1Lupdate",
        email: "user1@update.com",
        password: "password1"
      });
    expect(resp.body).toEqual(
      { user: {
      id: userIds[0],
      username: "u1update",
      firstName: "U1Fupdate",
      lastName: "U1Lupdate",
      email: "user1@update.com"
    }
  });
  });

  test("401 Unauthorized if incorrect password", async () => {
    const resp = await request(app)
      .patch(`/users/${userIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
        username: "u1update",
        firstName: "U1Fupdate",
        lastName: "U1Lupdate",
        email: "user1@update.com",
        password: "password2"
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("401 Unauthorized if incorrect user/token", async () => {
    const resp = await request(app)
      .patch(`/users/${userIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[1]}`)
      .send({
        username: "u1update",
        firstName: "U1Fupdate",
        lastName: "U1Lupdate",
        email: "user1@update.com",
        password: "password1"
      });
    expect(resp.statusCode).toEqual(401);
  });
  
  test("400 BadRequest with invalid data", async () => {
    const resp = await request(app)
      .patch(`/users/${userIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`)
      .send({
      username: 135,
      password: "password1"
    });
    expect(resp.statusCode).toEqual(400);
  });
});
/************************************** DELETE /users/:userId */
describe("DELETE /users/:userId", () => {
  test("works", async () => {
    const resp = await request(app)
      .delete(`/users/${userIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.body).toEqual(
      { deleted: "u1" });
  });

  test("401 Unauthorized if incorrect user/token", async () => {
    const resp = await request(app)
      .patch(`/users/${userIds[0]}`)
      .set("Authorization", `Bearer ${userTokens[1]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("401 Unauthorized if incorrect user", async () => {
    const resp = await request(app)
      .patch(`/users/1234`)
      .set("Authorization", `Bearer ${userTokens[0]}`);
    expect(resp.statusCode).toEqual(401);
  });
});