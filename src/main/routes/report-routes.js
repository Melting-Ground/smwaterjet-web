const express = require('express');
const ReportController = require('@controllers/report-controller');
const authenticate = require('@middlewares/jwt-authentication');
const creatMulter = require("@configs/multer-config");

const upload = creatMulter('reports');

const router = express.Router();

router.get('/', ReportController.getAllReports);
router.get('/search', ReportController.searchReports);
router.get('/:reportId', ReportController.getReportById);

router.put('/:reportId', authenticate, upload.array('newFiles', 5), ReportController.editReport);

router.post('/', authenticate, upload.array('files', 5), ReportController.createReport);

router.delete('/file/reportFileId', authenticate, ReportController.deleteFile);
router.delete('/:reportId', authenticate, ReportController.deleteReport);

module.exports = router;
