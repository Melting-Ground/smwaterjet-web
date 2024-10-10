class CertificatResponseDto {
    constructor(certificate) {
        this.id = certificate.id;
        this.path = certificate.path;
        this.uploaded_at = certificate.uploaded_at;
    }
}

module.exports = CertificatResponseDto;