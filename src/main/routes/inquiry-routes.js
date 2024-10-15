const express = require('express');
const InquiryController = require('@controllers/inquiry-controller');
const creatMulter = require("@configs/multer-config");
const userAuthenticate = require('@middlewares/user-authentication');
const authenticate = require('@middlewares/jwt-authentication');

const upload = creatMulter('inquiries');

const router = express.Router();

router.get('/', InquiryController.getAllInquiries);

router.get('/:inquiryId', InquiryController.getInquiryById);

router.post('/', upload.array('files', 10), InquiryController.createInquiry);

router.put('/:inquiryId', userAuthenticate, upload.array('newFiles', 10), InquiryController.editInquiry);

router.delete('/:inquiryId', userAuthenticate, InquiryController.deleteInquiry);

router.delete('/admin/:inquiryId', authenticate, InquiryController.deleteInquiry);

router.delete('/file/:inquiryFileId', InquiryController.deleteFile);

module.exports = router;