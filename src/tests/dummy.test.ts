import request from "supertest";
import app from "../app.js"

describe("Auth + Post API flow", () => {
  let token: string;

  it("should register a new user", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "Test User",
      email: "flow@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("user");
  });

  it("should login and get token", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "flow@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should create a post using token", async () => {
    const res = await request(app)
      .post("/api/v1/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "First Post from Flow Test",
        body: "This is the body content",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("post");
    expect(res.body.post.title).toBe("First Post from Flow Test");
  });
});
