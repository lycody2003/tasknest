const service = require('../services/taskService');
exports.list = async (req, res) => res.json({ tasks: await service.list(req.user._id, req.query) });
exports.create = async (req, res) => res.status(201).json({ task: await service.create(req.user._id, req.body) });
exports.update = async (req, res) => res.json({ task: await service.update(req.user._id, req.params.id, req.body) });
exports.remove = async (req, res) => { await service.remove(req.user._id, req.params.id); res.json({ message: 'Task deleted' }); };
