class PhotoResponseDto {
    constructor({id, title , content, year, path, uploaded_at}) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.year = year;
        this.path = path;
        this.uploaded_at = uploaded_at;
    }
}

module.exports = PhotoResponseDto;