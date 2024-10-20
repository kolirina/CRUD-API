import request from "supertest";
import { createServer } from "../src/server";

describe("User API", () => {
  let userId: string;
  let server: ReturnType<typeof createServer>;

  beforeAll((done) => {
    server = createServer();
    server.listen(done);
  });

  afterAll((done) => {
    server.close(done);
  });

  test("GET /api/users should return an empty array", async () => {
    const response = await request(server).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("POST /api/users should create a new user", async () => {
    const newUser = {
      username: "John Doe",
      age: 25,
      hobbies: ["reading", "swimming"],
    };

    const response = await request(server).post("/api/users").send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newUser);
    userId = response.body.id;
  });

  test("GET /api/users/{userId} should return the created user", async () => {
    const response = await request(server).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId);
  });

  test("PUT /api/users/{userId} should update the user", async () => {
    const updatedUser = {
      username: "John Smith",
      age: 26,
      hobbies: ["traveling"],
    };

    const response = await request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updatedUser);
    expect(response.body.id).toBe(userId);
  });

  test("DELETE /api/users/{userId} should delete the user", async () => {
    const response = await request(server).delete(`/api/users/${userId}`);
    expect(response.status).toBe(204);
  });

  test("GET /api/users/{userId} should return 404 for deleted user", async () => {
    const response = await request(server).get(`/api/users/${userId}`);
    expect(response.status).toBe(404);
  });
});
