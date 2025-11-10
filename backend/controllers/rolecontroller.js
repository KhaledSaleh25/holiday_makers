import Role from '../models/role.js';

export const getRoles = async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
};

export const addRole = async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json({ message: 'Role added', role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
