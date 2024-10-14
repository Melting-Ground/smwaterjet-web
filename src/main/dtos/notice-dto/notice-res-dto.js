class NoticeResponseDto {
    constructor(notice, files = null) {
        this.id = notice.id;
        this.title = notice.title;
        this.content = notice.content;
        this.files = files;
        this.created_at = notice.created_at;
    }
}

module.exports = NoticeResponseDto;