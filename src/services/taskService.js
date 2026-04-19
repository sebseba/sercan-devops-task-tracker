const { INITIAL_TASKS, ALLOWED_STATUSES } = require('../data/tasks');

function cloneTasks(list) {
  return JSON.parse(JSON.stringify(list));
}

/** In-memory task list (mutated by this module). */
let tasks = cloneTasks(INITIAL_TASKS);

function nextId() {
  const numericIds = tasks.map((t) => Number(t.id)).filter((n) => !Number.isNaN(n));
  const max = numericIds.length ? Math.max(...numericIds) : 0;
  return String(max + 1);
}

function normalizeTitle(title) {
  if (typeof title !== 'string') return '';
  return title.trim();
}

function titleExists(title) {
  const normalized = normalizeTitle(title).toLowerCase();
  return tasks.some((t) => t.title.trim().toLowerCase() === normalized);
}

function getAllTasks() {
  return [...tasks];
}

function createTask(title) {
  const clean = normalizeTitle(title);
  if (!clean) {
    return { ok: false, error: 'Task title is required and cannot be empty.', code: 'EMPTY_TITLE' };
  }
  if (titleExists(clean)) {
    return { ok: false, error: 'A task with this title already exists.', code: 'DUPLICATE_TITLE' };
  }
  const task = {
    id: nextId(),
    title: clean,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  return { ok: true, task };
}

function updateTaskStatus(id, status) {
  const task = tasks.find((t) => t.id === String(id));
  if (!task) {
    return { ok: false, error: 'Task not found.', code: 'NOT_FOUND' };
  }
  if (!ALLOWED_STATUSES.includes(status)) {
    return {
      ok: false,
      error: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}.`,
      code: 'INVALID_STATUS'
    };
  }
  task.status = status;
  return { ok: true, task };
}

function deleteTask(id) {
  const idx = tasks.findIndex((t) => t.id === String(id));
  if (idx === -1) {
    return { ok: false, code: 'NOT_FOUND', error: 'Task not found.' };
  }
  const [deletedTask] = tasks.splice(idx, 1);
  return { ok: true, task: deletedTask };
}

/**
 * Reset store to seed data (used by tests for isolation).
 */
function resetTasks() {
  tasks = cloneTasks(INITIAL_TASKS);
}

module.exports = {
  getAllTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  resetTasks,
  ALLOWED_STATUSES
};
