const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Sweet = require('../models/Sweet');

describe('Sweets Endpoints', () => {
  let userToken;
  let adminToken;

  beforeAll(async () => {
    jest.setTimeout(20000);
    await mongoose.connect(process.env.MONGODB_URI);
  });

  beforeEach(async () => {
    
    await User.deleteMany({});
    await Sweet.deleteMany({});

    const user = new User({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123'
    });
    await user.save();

    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    await admin.save();

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });
    
    // Debug: Check login response
    if (userLogin.status !== 200) {
      console.error('User login failed:', userLogin.status, userLogin.body);
    }
    
    userToken = userLogin.body.token;

    // Login admin user
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    
    // Debug: Check login response
    if (adminLogin.status !== 200) {
      console.error('Admin login failed:', adminLogin.status, adminLogin.body);
    }
    
    adminToken = adminLogin.body.token;

    // Verify tokens exist
    expect(userToken).toBeDefined();
    expect(adminToken).toBeDefined();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/sweets', () => {
    it('should allow admin to add new sweet', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.99,
        quantity: 50,
        description: 'Delicious milk chocolate bar'
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.message).toBe('Sweet added successfully');
      expect(response.body.sweet.name).toBe(sweetData.name);
      expect(response.body.sweet.price).toBe(sweetData.price);
    });

    it('should not allow regular user to add sweet', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.99,
        quantity: 50
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(403);

      expect(response.body.error).toMatch(/access denied|admin|privileges/i);
    });

    it('should return 401 for missing token', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.99,
        quantity: 50
      };

      const response = await request(app)
        .post('/api/sweets')
        .send(sweetData)
        .expect(401);

      expect(response.body.error).toBeTruthy();
    });

    it('should return 401 for invalid token', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.99,
        quantity: 50
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', 'Bearer invalid-token-123')
        .send(sweetData)
        .expect(401);

      expect(response.body.error).toBeTruthy();
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      await Sweet.create({
        name: 'Gummy Bears',
        category: 'gummy',
        price: 1.99,
        quantity: 100
      });
    });

    it('should get all sweets without authentication', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .expect(200);

      expect(response.body.sweets).toHaveLength(1);
      expect(response.body.sweets[0].name).toBe('Gummy Bears');
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Lollipop',
        category: 'lollipop',
        price: 0.99,
        quantity: 10
      });
      sweetId = sweet._id;
    });

    it('should allow user to purchase sweet', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 })
        .expect(200);

      expect(response.body.message).toBe('Purchase successful');
      expect(response.body.remainingQuantity).toBe(8);
    });

    it('should not allow purchase with insufficient stock', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 15 })
        .expect(400);

      expect(response.body.error).toBe('Insufficient stock');
    });
  });
});