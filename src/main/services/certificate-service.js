const db = require('../db/knex');
const CertiResDto = require('@dtos/certificate-dto/certificate-res-dto')
const Certificate = require('@models/certificate');
const Exception = require('../exceptions/exceptions');
const FileDeleteUtil = require('@utils/file-delete-util');

class CertificateService {
    static async getAllCertificates() {
        const certificates = await db('certificates'); 
        const certiResDtos = certificates.map(cert => new CertiResDto(cert));
        return certiResDtos;
    }

    static async getCertificateById(id) {
        const certificate = await db('certificates').where({ id }).first(); 
        if (certificate == null) {
            throw new Exception('ValueNotFoundException','Certificate not found');
        }
        return new CertiResDto(certificate);
    }

    static async createCertificate(certificateDto) {
        const newCertificate = new Certificate(certificateDto.path);
        await db('certificates').insert(newCertificate);
        return new CertiResDto(newCertificate);
    }
    
    static async deleteCertificate(id) {
        const certificate = await db('certificates').where({ id }).first();
        if (!certificate) {
            throw new Exception('ValueNotFoundException', 'Certificate not found');
        }
        const filePath = certificate.certificate_path;
        await FileDeleteUtil.deleteFile(filePath);

        const isDeleted = await db('certificates').where({ id }).del();
        if(isDeleted == 0){
            throw new Exception('ValueNotFoundException','Certificate not found');
        }
    }
}

module.exports = CertificateService;