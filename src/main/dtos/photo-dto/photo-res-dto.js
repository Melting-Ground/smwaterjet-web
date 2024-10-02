class PhotoDto{
    constructor({ photo }) {
        this.id = photo.id;
        this.title = photo.title;
        this.content = photo.content;
        this.year = photo.year;
        this.path = photo.path;
        this.uploaded_at = photo.uploaded_at;
    }
}

module.exports = PhotoDto;