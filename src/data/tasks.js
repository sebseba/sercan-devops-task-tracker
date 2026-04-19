/**
 * Seed data for the in-memory task store.
 * Used on startup so the UI has something to show before you add tasks.
 */
const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Write README for demo',
    status: 'done',
    createdAt: new Date('2026-04-01T10:00:00.000Z').toISOString()
  },
  {
    id: '2',
    title: 'Run Jenkins pipeline',
    status: 'in-progress',
    createdAt: new Date('2026-04-02T14:30:00.000Z').toISOString()
  },
  {
    id: '3',
    title: 'Prepare Azure Boards tasks',
    status: 'pending',
    createdAt: new Date('2026-04-03T09:15:00.000Z').toISOString()
  }
];

const ALLOWED_STATUSES = ['pending', 'in-progress', 'done'];

module.exports = {
  INITIAL_TASKS,
  ALLOWED_STATUSES
};
