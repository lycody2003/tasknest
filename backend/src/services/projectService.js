const Project = require('../models/Project');
const Task = require('../models/Task');
const AppError = require('../utils/AppError');

async function list(owner) {
  const projects = await Project.find({ owner }).sort({ updatedAt: -1 }).lean();
  const counts = await Task.aggregate([
    { $match: { owner: owner, status: { $ne: 'done' } } },
    { $group: { _id: '$project', count: { $sum: 1 } } }
  ]);
  const map = new Map(counts.map(x => [String(x._id), x.count]));
  return projects.map(p => ({ ...p, openTasks: map.get(String(p._id)) || 0 }));
}
async function create(owner, body) {
  if (!body.name || !body.name.trim()) throw new AppError('Project name is required');
  return Project.create({ name: body.name, description: body.description || '', color: body.color || 'violet', owner });
}
async function update(owner, id, body) {
  const project = await Project.findOneAndUpdate({ _id: id, owner }, {
    ...(body.name !== undefined && { name: body.name }),
    ...(body.description !== undefined && { description: body.description }),
    ...(body.color !== undefined && { color: body.color })
  }, { new: true, runValidators: true });
  if (!project) throw new AppError('Project not found', 404);
  return project;
}
async function remove(owner, id) {
  const project = await Project.findOneAndDelete({ _id: id, owner });
  if (!project) throw new AppError('Project not found', 404);
  await Task.deleteMany({ project: id, owner });
}
module.exports = { list, create, update, remove };
