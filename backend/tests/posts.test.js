const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

describe('Blog API', () => {
  test('GET / should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Welcome to the Blog API!');
  });

  test('POST /api/posts should create a post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ title: 'Test Post', content: 'Test Content' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('Test Post');
  });
});






// const request = require('supertest');
// const app = require('../app');

// describe('Blog API', () => {
//   test('GET / should return welcome message', async () => {
//     const res = await request(app).get('/');
//     expect(res.statusCode).toBe(200);
//     expect(res.text).toBe('Welcome to the Blog API!');
//   });

//   test('POST /api/posts should create a post', async () => {
//     const res = await request(app)
//       .post('/api/posts')
//       .send({ title: 'Test Post', content: 'Test Content' });
//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty('id');
//     expect(res.body.title).toBe('Test Post');
//   });
// });







// const request = require('supertest');
// const app = require('../app');

// describe('Blog API', () => {
//   test('GET / should return welcome message', async () => {
//     const res = await request(app).get('/');
//     expect(res.statusCode).toBe(200);
//     expect(res.text).toBe('Welcome to the Blog API!');
//   });

//   test('POST /api/posts should create a post', async () => {
//     const res = await request(app)
//       .post('/api/posts')
//       .send({ title: 'Test Post', content: 'Test Content' });
//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty('id');
//     expect(res.body.title).toBe('Test Post');
//   });
// });