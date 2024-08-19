const request = require('supertest');
const app = require('../../index');

describe('POST /register', () => {
  it('should create a new user when login and password are provided', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        login: 'Joe',
        password: '123',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('login', 'Joe');
  });

  it('should return 400 if login is missing', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        password: '123',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(typeof res.body.error).toBe('string');
  });

  it('should return 400 if password is missing', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        login: 'Joe',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(typeof res.body.error).toBe('string');
  });

  it('should return 409 if user already exists', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        login: 'Joe',
        password: '123',
      });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
    expect(typeof res.body.error).toBe('string');
  });
});
