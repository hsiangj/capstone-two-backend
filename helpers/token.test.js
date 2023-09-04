const { createToken } = require("./token");
const jwt = require("jsonwebtoken");
const process = require('process');

process.env.JWT_SECRET_KEY = 'test_secret_key';

describe("createToken", () => {
  it("should generate token", () => {
    const user = { id: 1, username: "testuser" }
    const token = createToken(user);
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "testuser",
      id: 1
    })
  });

});