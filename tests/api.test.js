const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes.js');
const receiptsRoutes = require('../routes/receiptsRoutes.js');
const supervisorRoutes = require('../routes/supervisorRoutes.js');
const jdRoutes = require('../routes/jdRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/receipts', receiptsRoutes);
app.use('/api/supervisor', supervisorRoutes);
app.use('/api/jd', jdRoutes);

describe('API Endpoints', () => {
  let token;

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        fullName: 'Test User',
        roleId: 1,
        amcId: 1,
        plainPassword: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('userId');
  });

  it('should login and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should create a new receipt', async () => {
    const res = await request(app)
      .post('/api/receipts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        receipt_date: '2025-06-26',
        book_number: 'B001',
        receipt_number: 'R001',
        trader_id: 1,
        payee_address: '123 Street',
        commodity_id: 1,
        quantity: 10,
        unit_id: 1,
        nature_of_receipt: 'Sample',
        value_inr: 1000,
        fees_paid_inr: 50,
        vehicle_number: 'V123',
        invoice_number: 'INV001',
        collection_location: 'Location A',
        generated_by: 1,
        amc_id: 1
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('receipt_id');
  });

  it('should get monthly stats', async () => {
    const res = await request(app)
      .get('/api/receipts/stats/2025/6/1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('totalReceipts');
    expect(res.body).toHaveProperty('activeMembers');
    expect(res.body).toHaveProperty('totalValue');
    expect(res.body).toHaveProperty('totalFees');
  });

  it('should access supervisor route', async () => {
    const res = await request(app)
      .get('/api/supervisor')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Supervisor route is working');
  });

  it('should access jd route', async () => {
    const res = await request(app)
      .get('/api/jd')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('JD route is working');
  });
});
