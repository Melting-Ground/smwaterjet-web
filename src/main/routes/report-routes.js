const express = require('express');
const ReportController = require('@controllers/report-controller');
const authenticate = require('@middlewares/jwt-authentication');
const creatMulter = require("@configs/multer-config");

const upload = creatMulter('reports');

const router = express.Router();

router.get('/', ReportController.getAllReports);

router.get('/:reportId', ReportController.getReportById);

router.get('/year/:year', ReportController.getReportByYear);

router.post('/', authenticate, upload.array('files', 10), ReportController.createReport);

router.delete('/:reportId', authenticate, ReportController.deleteReport);

module.exports = router;