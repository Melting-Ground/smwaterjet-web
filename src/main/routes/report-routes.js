const express = require('express');
const reportController = require('@controllers/report-controller');
const authenticate = require('@middlewares/jwt-auth-middleware');
const creatMulter = require("@configs/multer-config");

const upload = creatMulter('reports');

const router = express.Router();

router.get('/', reportController.getAllReports);
router.get('/:reportId', reportController.getReportById);
router.get('/year/:year', reportController.getReportByYear);
router.post('/', authenticate, upload.array('files', 10), reportController.createReport);
router.delete('/:reportId', authenticate, reportController.deleteReport);

module.exports = router;