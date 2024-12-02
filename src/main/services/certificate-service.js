const db = require('@configs/knex');
const CertiResDto = require('@dtos/certificate-dto/certificate-res-dto');
const Certificate = require('@models/certificate');
const Exception = require('@exceptions/exception');
const fileDeleteUtil = require('@utils/file-delete-util');

class CertificateService {
    static async getAllCertificates(pagination) {
        const offset = pagination.getOffset();
        const limit = pagination.limit;

        const totalItemsResult = await db('certificates').count('id as count').first();
        const totalCount = totalItemsResult.count;

        const certificates = await db('certificates').limit(limit).offset(offset);
        const certiResDtos = certificates.map(cert => new CertiResDto(cert));
        return {
            items: certiResDtos,
            pagination: pagination.getPaginationInfo(totalCount),
        };
    }

    static async getCertificateById(id) {
        const certificate = await db('certificates').where({ id }).first();
        if (certificate == null) {
            throw new Exception('ValueNotFoundException', 'Certificate is not found');
        }
        return new CertiResDto(certificate);
    }

    static async createCertificate(certificateDto) {
        const newCertificate = new Certificate(certificateDto);
        await db('certificates').insert(newCertificate);
        const certiResDto = new CertiResDto(newCertificate);
        return certiResDto;
    }

    static async deleteCertificate(id) {
        const certificate = await db('certificates').where({ id }).first();
        if (certificate == null) {
            throw new Exception('ValueNotFoundException', 'Certificate is not found');
        }
        const filePath = certificate.path;
        await fileDeleteUtil.deleteFile(filePath);

        await db('certificates').where({ id }).del();
    }
}

module.exports = CertificateService;