const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../index");
const { sequelize } = require("../config/db");
const { generateToken } = require("../utilities/jwt");
require("dotenv").config();

let server;

beforeAll(async () => {
  server = app.listen(5050);
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

describe("Token Generation", () => {
  it("should generate a token with correct user details and expiration time", () => {
    const user = { userId: "123", email: "mide@example.com" };
    const token = generateToken(user);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(decoded.userId).toBe(user.userId);
    expect(decoded.email).toBe(user.email);
    const expiration = new Date(decoded.exp * 1000);
    const now = new Date();
    expect(expiration > now).toBe(true);
  });
});
