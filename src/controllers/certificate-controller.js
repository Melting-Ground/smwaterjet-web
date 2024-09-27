const CertificateDto = require('@dtos/certificate-dot/certificate-dto')
const CertiResDto = require('@dtos/certificate-res-dto/certificate-res-dto')


class CertificateController {
    static async getAllCertificates(req, res, next) {
        try {
            const certiResDtos = await certificateService.getAllCertificates();
            res.status(200).json(certiResDtos);
        } catch (error) {
            next(error); 
        }
    }
    static async getCertificateById(req, res, next) {
        try {
            const id = req.params;
            const certiResDto = await certificateService.getCertificateById(id);
            res.status(200).json(certiResDto);
        } catch (error) {
            next(error); 
        }
    }
    static async createCertificate(req, res, next) {
        try {
            const certificateDto = new CertificateDto(req.body);
            const certiResDto = await certificateService.createCertificate(certificateDto);
    
            res.status(201).json(certiResDto);
        } catch (error) {
            next(error); 
        }
    }

    static async deleteCertificate(req, res, next) {
        try {
            const id = req.params;
            await certificateService.deleteCertificate(id);

            res.status(200).json({ message: 'Certificate deleted successfully' });
        } catch (error) {
            next(error); 
        }
    }
}

module.exports = CertificateController;