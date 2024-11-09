class PhotoResponseDto {
    constructor({ id, title, year, path, uploaded_at }) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.path = path;
        this.uploaded_at = uploaded_at;
    }
}

module.exports = PhotoResponseDto;