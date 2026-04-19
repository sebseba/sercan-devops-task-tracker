const taskService = require('../services/taskService');

function listTasks(_req, res) {
  res.json(taskService.getAllTasks());
}

function addTask(req, res) {
  const { title } = req.body || {};
  const result = taskService.createTask(title);

  if (!result.ok) {
    if (result.code === 'EMPTY_TITLE') {
      return res.status(400).json({ message: result.error });
    }
    if (result.code === 'DUPLICATE_TITLE') {
      return res.status(409).json({ message: result.error });
    }
    return res.status(400).json({ message: result.error });
  }

  return res.status(201).json({
    message: 'Task successfully created!',
    task: result.task
  });
}

function patchTaskStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body || {};
  const result = taskService.updateTaskStatus(id, status);

  if (!result.ok) {
    if (result.code === 'NOT_FOUND') {
      return res.status(404).json({ message: result.error });
    }
    if (result.code === 'INVALID_STATUS') {
      return res.status(400).json({ message: result.error });
    }
    return res.status(400).json({ message: result.error });
  }

  return res.json(result.task);
}

function removeTask(req, res) {
  const { id } = req.params;
  const result = taskService.deleteTask(id);

  if (!result.ok) {
    if (result.code === 'NOT_FOUND') {
      return res.status(404).json({ message: result.error });
    }
    return res.status(400).json({ message: result.error });
  }

  return res.json({
    message: 'Task deleted successfully.',
    task: result.task
  });
}

module.exports = {
  listTasks,
  addTask,
  patchTaskStatus,
  removeTask
};
