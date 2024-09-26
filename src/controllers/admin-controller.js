const AdminDTO = require('../dtos/admin-dto');
const adminService = require('../services/admin-service');

class AdminController {
  static async loginAdmin(req, res) {
    console.log(req.body);

    const adminDto = new AdminDTO(req.body);
    console.log(adminDto.phoneNumber);
    console.log(adminDto.password);

    const token = await adminService.loginAdmin(adminDto);
    res.status(200).json(token);
  }
}

module.exports = AdminController;