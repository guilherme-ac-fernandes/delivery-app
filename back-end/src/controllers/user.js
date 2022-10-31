const { userService } = require('../services');

const saleController = {
  getAll: async (_req, res) => {
    const users = await userService.findAll();

    return res.status(200).json(users);
  },

  getById: async (req, res) => {
    const { userId } = req.params;
    const user = await userService.findAll({ where: { userId } });

    return res.status(200).json(user);
  },

  create: async () => null,
};

module.exports = saleController;