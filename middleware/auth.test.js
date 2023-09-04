require('dotenv').config();
const { authenticateJWT, ensureCorrectUser } = require("../middleware/auth");
const { UnauthorizedError } = require("../expressErrors");
const jwt = require("jsonwebtoken");


const SECRET_KEY = process.env.JWT_SECRET_KEY;
const goodToken = jwt.sign({ id: 1, username: "testuser" }, SECRET_KEY);
const badToken = jwt.sign({ id: 1, username: "testuser" }, 'badToken');

describe("authenticateJWT", () => {
  it("should set res.locals.user with valid JWT token", () => {
    const req = { headers: { authorization: `Bearer ${goodToken}` }}
    const res = { locals: {} };
    const next = jest.fn();
    
    authenticateJWT(req, res, next);
   
    expect(res.locals).toEqual({ 
      user: {
        iat: expect.any(Number),
        id: 1, 
        username: "testuser"
      }
    });

    expect(next).toHaveBeenCalled();
  });

  it("should not throw error if no token in header", () => {
    const req = {}
    const res = { locals: {} };
    const next = jest.fn();
    
    authenticateJWT(req, res, next);
   
    expect(res.locals).toEqual({});
  });

  it("should not store res.locals if incorrect token", () => {
    const req = {headers: { authorization: `Bearer ${badToken}` }}
    const res = { locals: {} };
    const next = jest.fn();
    
    authenticateJWT(req, res, next);
   
    expect(res.locals).toEqual({});
  });
});

describe("ensureCorrectUser", () => {
  it("should allow access for valid user", () => {
    const user = {username: 'testuser', id: 1}
    const req = { params: {userId: 1} }
    const res = { locals: { user } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    
    ensureCorrectUser(req, res, next);
  });

  it("should throw UnauthorizedError for mismatch of userId", () => {
    const user = {username: 'testuser', id: 1}
    const req = { params: {userId: 2} }
    const res = { locals: { user } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    
    ensureCorrectUser(req, res, next);
  });

  it("should throw UnauthorizedError for no user", () => {
    const user = {};
    const req = { params: {userId: 2} }
    const res = { locals: { user } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    
    ensureCorrectUser(req, res, next);
  });

});