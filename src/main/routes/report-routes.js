const express = require('express');
const ReportController = require('@controllers/report-controller');
const authenticate = require('@middlewares/jwt-authentication');
const creatMulter = require("@configs/multer-config");

const upload = creatMulter('reports');

const router = express.Router();

router.get('/', ReportController.getAllReports);
router.get('/year/:year', ReportController.getReportByYear);
router.get('/:reportId', ReportController.getReportById);

router.put('/:reportId', authenticate, upload.none(), ReportController.editReport);

router.post('/', authenticate, upload.none(), ReportController.createReport);

router.delete('/:reportId', authenticate, ReportController.deleteReport);

module.exports = router;
