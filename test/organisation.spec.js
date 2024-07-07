const request = require("supertest");
const app = require("../index");
const { User, Organisation } = require("../models");
const { sequelize } = require("../config/db");

describe("Organisation Access", () => {
  it("should prevent users from accessing organisations they don't belong to", async () => {
    // Create a user
    const userData = {
      firstName: "Mide",
      lastName: "Doe",
      email: "mide@example.com",
      password: "password",
      phone: "1234567890",
    };

    await request(app).post("/auth/register").send(userData);


    const user = await request(app)
      .post("/auth/login")
      .send({ email: "mide@example.com", password: "password" });

    const token = user.body.data.accessToken;


    const response = await request(app)
      .get("/api/organisations/unauthorizedOrgId")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Access denied");
  });
});
