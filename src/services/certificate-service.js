const db = require('../db/knex');
const CertiResDto = require('@dtos/certificate-dto/certificate-res-dto')
const Certificate = require('@models/certificate');
const Exception = require('../exceptions/exceptions');

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

    async createCertificate(certificateDto) {
        const newCertificate = new Certificate(certificateDto.pat);
        const createdCertificate = await db('certificates').insert(newCertificate).returning('*'); 
        return new CertiResDto(createdCertificate);
    }
    
    async deleteCertificate(id) {
        const isDeleted = await db('certificates').where({ id }).del();
        if(isDeleted == 0){
            throw new Exception('ValueNotFoundException','Certificate not found');
        }
    }
}

module.exports = CertificateService;