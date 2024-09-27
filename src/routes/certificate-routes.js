const express = require('express');
const CertificateController = require('@controllers/certificate-controller');

const router = express.Router();

router.get('/certificates', CertificateController.getAllCertificates);
router.get('/certificates/:certificateId', CertificateController.getCertificateById);
router.post('/certificates', CertificateController.createCertificate);
router.delete('/certificates/:certificateId', CertificateController.deleteCertificate);


module.exports = router;