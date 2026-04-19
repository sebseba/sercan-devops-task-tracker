const request = require('supertest');
const app = require('../src/app');
const { resetTasks } = require('../src/services/taskService');

describe('devops-task-tracker API', () => {
  beforeEach(() => {
    resetTasks();
  });

  test('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  test('GET /api/tasks returns an array', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/tasks with valid title creates task', async () => {
    const title = `Unique task ${Date.now()}`;
    const res = await request(app).post('/api/tasks').send({ title });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      message: 'Task successfully created!',
      task: {
        title,
        status: 'pending'
      }
    });
    expect(res.body.task).toHaveProperty('id');
    expect(res.body.task).toHaveProperty('createdAt');
  });
  

  test('POST /api/tasks with empty title fails', async () => {
    const res = await request(app).post('/api/tasks').send({ title: '   ' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('POST /api/tasks with duplicate title fails', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Write README for demo' });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('message');
  });

  test('PATCH /api/tasks/:id/status updates status', async () => {
    const res = await request(app).patch('/api/tasks/1/status').send({ status: 'done' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: '1', status: 'done' });
  });

  test('PATCH /api/tasks/:id/status with invalid status fails', async () => {
    const res = await request(app).patch('/api/tasks/1/status').send({ status: 'blocked' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});
