class NoticeResponseDto {
    constructor(notice, files = []) {
        this.id = notice.id;
        this.title = notice.title;
        this.content = notice.content;
        this.files = Array.isArray(files) ? files : [];
        this.created_at = notice.created_at;
    }
}

module.exports = NoticeResponseDto;