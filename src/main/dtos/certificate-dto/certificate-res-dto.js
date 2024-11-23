class CertificatResponseDto {
    constructor({ id, path, title, uploaded_at }) {
        this.id = id;
        this.path = path;
        this.title = title;
        this.uploaded_at = uploaded_at;
    }
}

module.exports = CertificatResponseDto;