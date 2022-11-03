const { userService } = require('../services');

const userController = {
  getAll: async (_req, res, next) => {
    const users = await userService.getAll();
    if (!users || users.length === 0) {
      return next({ code: 404, message: 'Can\'t find users' });
    }
    return res.status(200).json(users);
  },

  getByRole: async (req, res, next) => {
    const { role } = req.params;
    const users = await userService.getByRole(role);
    if (!users || users.length === 0) {
      return next({ code: 404, message: 'Can\'t find users' });
    }
    return res.status(200).json(users);
  },

  getById: async (req, res, next) => {
    const { id } = req.params;
    const user = await userService.getById(id);
    if (!user || user.length === 0) {
      return next({ code: 404, message: 'Can\'t find user' });
    }
    return res.status(200).json(user);
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.login(email, password);

    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(user);
  },

  create: async (req, res) => {
    const { name, email, password } = req.body;
    const user = await userService.create(name, email, password);
    if (!user) return res.status(409).json({ error: 'Conflict' });
    return res.status(201).json({ message: 'Created' });
  },
};

module.exports = userController;