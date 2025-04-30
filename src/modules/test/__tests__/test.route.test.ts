import request from 'supertest';
import app from '../../../app';

describe('Connection Test', () => {
  it('should respond with ok', async () => {
    const response = await request(app).get('/api/v1/test');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
