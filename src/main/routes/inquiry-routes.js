const express = require('express');
const InquiryController = require('@controllers/inquiry-controller');
const creatMulter = require("@configs/multer-config");
const userAuthenticate = require('@middlewares/user-authentication');
const authenticate = require('@middlewares/jwt-authentication');

const upload = creatMulter('inquiries');

const router = express.Router();

router.get('/', InquiryController.getAllInquiries);
router.get('/search', InquiryController.searchInquiries);
router.get('/admin/:inquiryId', authenticate, InquiryController.getInquiryById);
router.get('/:inquiryId', userAuthenticate, InquiryController.getInquiryById);

router.post('/', upload.array('files', 5), InquiryController.createInquiry);

router.put('/:inquiryId', userAuthenticate, upload.array('newFiles', 5), InquiryController.editInquiry);

router.delete('/admin/:inquiryId', authenticate, InquiryController.deleteInquiry);
router.delete('/files/:inquiryFileId', userAuthenticate, InquiryController.deleteFile);
router.delete('/:inquiryId', userAuthenticate, InquiryController.deleteInquiry);

module.exports = router;