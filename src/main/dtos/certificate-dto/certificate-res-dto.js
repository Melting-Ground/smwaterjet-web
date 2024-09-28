class CertificateDto {
    constructor(certificate) {
        this.id = certificate.id;
        this.path = certificate.certificate_path;
        this.uploaded_at = certificate.uploaded_at;
    }
  }
  
  module.exports = CertificateDto;