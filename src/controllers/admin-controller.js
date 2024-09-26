const AdminDTO = require('../dtos/admin-dto/admin-dto');
const adminService = require('../services/admin-service');

const loginAdmin = async (req, res) => {
  const adminDto = new AdminDTO(req.body);

  try {
      const token = await adminService.loginAdmin(adminDto);
      res.status(200).json(token);
  } catch (error) {
      res.status(401).json({ error: error.message });
  }
};

module.exports = {loginAdmin};