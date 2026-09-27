const service = require('../services/projectService');
exports.list = async (req, res) => res.json({ projects: await service.list(req.user._id) });
exports.create = async (req, res) => res.status(201).json({ project: await service.create(req.user._id, req.body) });
exports.update = async (req, res) => res.json({ project: await service.update(req.user._id, req.params.id, req.body) });
exports.remove = async (req, res) => { await service.remove(req.user._id, req.params.id); res.json({ message: 'Project deleted' }); };
