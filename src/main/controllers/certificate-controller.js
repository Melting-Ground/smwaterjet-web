const CertificateDto = require('@dtos/certificate-dto/certificate-dto');
const CertificateService = require('@services/certificate-service');

class CertificateController {
    static async getAllCertificates(req, res, next) {
        try {
            const certiResDtos = await CertificateService.getAllCertificates();
            res.status(200).json(certiResDtos);
        } catch (error) {
            next(error);
        }
    }
    static async getCertificateById(req, res, next) {
        try {
            const { certificateId } = req.params;
            const certiResDto = await CertificateService.getCertificateById(certificateId);
            res.status(200).json(certiResDto);
        } catch (error) {
            next(error);
        }
    }
    static async createCertificate(req, res, next) {
        try {
            const filePath = req.file.path;
            const certificateDto = new CertificateDto(filePath);
            const certiResDto = await CertificateService.createCertificate(certificateDto);

            res.status(201).json(certiResDto);
        } catch (error) {
            next(error);
        }
    }

    static async deleteCertificate(req, res, next) {
        try {
            const { certificateId } = req.params;
            await CertificateService.deleteCertificate(certificateId);

            res.status(200).json({ message: 'Certificate deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CertificateController;