const request = require('supertest');
const mongoose = require('mongoose');

// Mock mongoose connect to avoid real DB connections during basic route testing
jest.mock('mongoose', () => {
  const original = jest.requireActual('mongoose');
  return {
    ...original,
    connect: jest.fn().mockResolvedValue(true),
  };
});

let server;

beforeAll(() => {
  server = require('../server');
});

afterAll((done) => {
  server.close(done);
});

describe('Auth Endpoints', () => {
  it('should return 400 if login credentials are not provided', async () => {
    const res = await request(server).post('/api/auth/login').send({});
    // We expect the request to reach the route and fail validation/auth (likely 400 or 401)
    expect([400, 401]).toContain(res.statusCode);
  });

  it('should apply rate limiting after 5 requests', async () => {
    // Make 5 requests
    for (let i = 0; i < 5; i++) {
      await request(server).post('/api/auth/login').send({});
    }
    // The 6th request should hit the rate limiter
    const res = await request(server).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(429); // Too Many Requests
    expect(res.body.error).toBe('Too many attempts from this IP, please try again after 15 minutes');
  });
});
