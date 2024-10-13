const express = require('express');
const inquiryController = require('@controllers/inquiry-controller');
const creatMulter = require("@configs/multer-config")

const upload = creatMulter('inquiries')

const router = express.Router();

router.get('/', inquiryController.getAllInquiries);

router.get('/:inquiryId', inquiryController.getInquiryById);

router.post('/', upload.array('files', 10), inquiryController.createInquiry);

router.put('/:inquiryId', inquiryController.editInquiry);

router.delete('/:inquiryId', inquiryController.deleteInquiry);

router.delete('/:inquiryFileId', inquiryController.deleteFile);

module.exports = router;