const request = require("supertest");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/register */
describe("POST /auth/register", () => {
  const newData = {
    username: "newuser",
    firstName: "new",
    lastName: "user",
    email: "new@user.com",
    password: "password1"
  }
  test("works", async () => {
    const resp = await request(app).post("/auth/register").send(newData);
    expect(resp.body).toEqual(
      {'user': {
        username: "newuser",
        firstName: "new",
        lastName: "user",
        email: "new@user.com",
        id: expect.any(Number)
        }, 
        'token': expect.any(String)});
  });

  test("400 BadRequestError with missing fields", async () => {
    const resp = await request(app).post("/auth/register").send({username: "newuser", password: "password1"});
    expect(resp.statusCode).toEqual(400);
  });

  test("400 BadRequestError with invalid data - email", async () => {
    const resp = await request(app).post("/auth/register").send({...newData, email: 'notemail'});
    expect(resp.statusCode).toEqual(400);
  });

  test("400 BadRequestError with invalid data - password too short", async () => {
    const resp = await request(app).post("/auth/register").send({...newData, password: 'none'});
    expect(resp.statusCode).toEqual(400);
  });
  
  test("400 BadRequestError with invalid data - last name empty with space", async () => {
    const resp = await request(app).post("/auth/register").send({...newData, lastName: ' '});
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/login */
describe("POST /auth/login", () => {
  test("works", async () => {
    const resp = await request(app).post("/auth/login").send({
      username: "u1",
      password: "password1"
    });
    expect(resp.body).toEqual({
    'token': expect.any(String)});
  });

  test("400 BadRequest with missing data", async () => {
    const resp = await request(app).post("/auth/login").send({
      username: "u1"
    });
    expect(resp.statusCode).toEqual(400);
  });
  
  test("400 BadRequest with invalid data", async () => {
    const resp = await request(app).post("/auth/login").send({
      username: 135,
      password: "password1"
    });
    expect(resp.statusCode).toEqual(400);
  });
  test("401 Unauthorized with non-existent user", async () => {
    const resp = await request(app).post("/auth/login").send({username: "wronguser", password: "password1"});
    expect(resp.statusCode).toEqual(401);
  });

  test("401 Unauthorized with incorrect password", async () => {
    const resp = await request(app).post("/auth/login").send({
      username: "u1",
      password: "wrongpassword"
    });
    expect(resp.statusCode).toEqual(401);
  });

});