const express = require('express');
const creatMulter = require("@configs/multer-config");
const authenticate = require('@middlewares/jwt-authentication');
const noticeController = require('@controllers/notice-controller');

const upload = creatMulter('notices')

const router = express.Router();

router.get('/', noticeController.getAllNotices);

router.get('/:noticeId', noticeController.getNoticeById);

router.post('/', authenticate, upload.array('files', 10), noticeController.createNotice);

router.put('/:noticeId', authenticate, upload.array('newFiles', 10), noticeController.editNotice);

router.delete('/:noticeId', authenticate, noticeController.deleteNotice);

router.delete('/file/:noticeFileId', authenticate, noticeController.deleteFile);

module.exports = router;