const express = require('express');
const reportController = require('@controllers/report-controller');
const authenticate = require('@middlewares/jwt-auth-middleware');
const creatMulter = require("@configs/multer-config");

const uploadReport = creatMulter('reports', true);

const router = express.Router();

router.get('/', reportController.getAllReports);
router.get('/:reportId', reportController.getReportById);
router.get('/year/:year', reportController.getReportByYear);
router.post('/', authenticate, reportController.createReport);
router.delete('/:reportId', authenticate, reportController.deleteReport);

router.post('/file', authenticate, uploadReport.single('file'), reportController.uploadFile);
router.delete('/file', authenticate, uploadReport.single('file'), reportController.deleteFile);

module.exports = router;