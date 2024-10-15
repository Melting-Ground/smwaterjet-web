const express = require('express');
const creatMulter = require("@configs/multer-config");
const authenticate = require('@middlewares/jwt-authentication');
const NoticeController = require('@controllers/notice-controller');

const upload = creatMulter('notices');

const router = express.Router();

router.get('/', NoticeController.getAllNotices);

router.get('/:noticeId', NoticeController.getNoticeById);

router.post('/', authenticate, upload.array('files', 10), NoticeController.createNotice);

router.put('/:noticeId', authenticate, upload.array('newFiles', 10), NoticeController.editNotice);

router.delete('/:noticeId', authenticate, NoticeController.deleteNotice);

router.delete('/file/:noticeFileId', authenticate, NoticeController.deleteFile);

module.exports = router;