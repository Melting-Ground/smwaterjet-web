const express = require('express');
const certificateController = require('@controllers/certificate-controller');
const authenticate = require('@middlewares/jwt-auth-middleware')
const creatMulter = require("@configs/multer-config")

const upload = creatMulter('certificates')

const router = express.Router();

router.get('/certificates', certificateController.getAllCertificates);

router.get('/certificates/:certificateId', certificateController.getCertificateById);

router.post('/certificates', authenticate, upload.single('file'), certificateController.createCertificate);

router.delete('/certificates/:certificateId', authenticate, certificateController.deleteCertificate);

module.exports = router;