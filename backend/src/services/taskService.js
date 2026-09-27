const Task = require('../models/Task');
const Project = require('../models/Project');
const AppError = require('../utils/AppError');

async function list(owner, query = {}) {
  const filter = { owner };
  if (query.project) filter.project = query.project;
  if (query.status && ['todo', 'in-progress', 'done'].includes(query.status)) filter.status = query.status;
  if (query.search) filter.title = { $regex: query.search.slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  return Task.find(filter).populate('project', 'name color').sort({ dueDate: 1, createdAt: -1 });
}
async function create(owner, body) {
  if (!body.title || !body.title.trim()) throw new AppError('Task title is required');
  if (!body.project) throw new AppError('Choose a project for this task');
  if (!await Project.exists({ _id: body.project, owner })) throw new AppError('Project not found', 404);
  return Task.create({
    title: body.title, description: body.description || '',
    project: body.project, owner, status: body.status || 'todo',
    priority: body.priority || 'medium', dueDate: body.dueDate || null
  });
}
async function update(owner, id, body) {
  if (body.project && !await Project.exists({ _id: body.project, owner })) throw new AppError('Project not found', 404);
  const allowed = ['title', 'description', 'status', 'priority', 'dueDate', 'project'];
  const update = {};
  allowed.forEach(k => { if (body[k] !== undefined) update[k] = body[k] === '' && k === 'dueDate' ? null : body[k]; });
  const task = await Task.findOneAndUpdate({ _id: id, owner }, update, { new: true, runValidators: true }).populate('project', 'name color');
  if (!task) throw new AppError('Task not found', 404);
  return task;
}
async function remove(owner, id) {
  const task = await Task.findOneAndDelete({ _id: id, owner });
  if (!task) throw new AppError('Task not found', 404);
}
module.exports = { list, create, update, remove };
