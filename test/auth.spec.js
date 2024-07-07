const request = require('supertest');
const app = require('../index');

describe('User Registration', () => {
  it('should register user successfully with default organisation', async () => {
    const userData = {
      firstName: 'Mide',
      lastName: 'Giwa',
      email: 'mide@example.com',
      password: 'password',
      phone: '1234567890',
    };

    const response = await request(app)
      .post('/auth/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.user.firstName).toBe(userData.firstName);
    expect(response.body.data.user.lastName).toBe(userData.lastName);
    expect(response.body.data.user.email).toBe(userData.email);
    expect(response.body.data.user.phone).toBe(userData.phone);
    expect(response.body.data.accessToken).toBeDefined();
  });

  it('should log the user in successfully', async () => {
    const loginData = {
      email: 'mide@example.com',
      password: 'password',
    };

    const response = await request(app)
      .post('/auth/login')
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.user.email).toBe(loginData.email);
    expect(response.body.data.accessToken).toBeDefined();
  });

  it('should fail if required fields are missing', async () => {
    const incompleteData = {
      lastName: 'Giwa',
      email: 'mide@example.com',
      password: 'password',
    };

    const response = await request(app)
      .post('/auth/register')
      .send(incompleteData);

    expect(response.status).toBe(422);
    expect(response.body.message).toContain('All fields are required');
  });

  it('should fail if there’s duplicate email', async () => {
    const userData = {
      firstName: 'Mide',
      lastName: 'Giwa',
      email: 'mide@example.com',
      password: 'password',
      phone: '0987654321',
    };

    const response = await request(app)
      .post('/auth/register')
      .send(userData);

    expect(response.status).toBe(422);
    expect(response.body.message).toContain('Email already exists');
  });
});
