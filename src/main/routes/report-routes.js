const express = require('express');
const ReportController = require('@controllers/report-controller');
const authenticate = require('@middlewares/jwt-authentication');

const router = express.Router();

router.get('/', ReportController.getAllReports);
router.get('/year/:year', ReportController.getReportByYear);
router.get('/:reportId', ReportController.getReportById);

router.put('/:reportId', authenticate, ReportController.editReport);

router.post('/', authenticate, ReportController.createReport);

router.delete('/:reportId', authenticate, ReportController.deleteReport);

module.exports = router;
