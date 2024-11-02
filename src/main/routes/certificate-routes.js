const express = require('express');
const CertificateController = require('@controllers/certificate-controller');
const authenticate = require('@middlewares/jwt-authentication');
const creatMulter = require("@configs/multer-config");

const upload = creatMulter('certificates');

const router = express.Router();

router.get('/certificates', CertificateController.getAllCertificates);

router.get('/certificates/:certificateId', CertificateController.getCertificateById);

router.post('/certificates', upload.single('file'), CertificateController.createCertificate);

router.delete('/certificates/:certificateId', authenticate, CertificateController.deleteCertificate);

module.exports = router;