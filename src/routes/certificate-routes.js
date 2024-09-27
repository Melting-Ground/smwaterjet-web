const express = require('express');
const CertificateController = require('@controllers/certificate-controller');
const authenticate = require('@middlewares/jwt-auth-middleware')

const router = express.Router();

router.get('/certificates', CertificateController.getAllCertificates);

router.get('/certificates/:certificateId', CertificateController.getCertificateById);

router.post('/certificates', authenticate, CertificateController.createCertificate);

router.delete('/certificates/:certificateId', authenticate, CertificateController.deleteCertificate);

module.exports = router;