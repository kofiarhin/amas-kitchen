const request = require("supertest");

jest.mock("../config/env", () => ({
  getConfig: () => ({ clientOrigins: ["http://localhost:5173"], deliveryFeePence: 300 }),
}));
jest.mock("../services/publicBootstrap", () => ({
  buildPublicBootstrap: jest.fn().mockResolvedValue({ menu: [], deliveryZones: [], ordering: { canOrder: false } }),
}));

const app = require("../app");

test("health endpoint returns readiness metadata and security headers", async () => {
  const response = await request(app).get("/health").expect(200);
  expect(response.body).toMatchObject({ status: "ok", service: "amas-kitchen-api" });
  expect(response.headers).toHaveProperty("x-content-type-options", "nosniff");
});
