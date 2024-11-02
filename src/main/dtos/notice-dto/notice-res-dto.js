class NoticeResponseDto {
    constructor(notice, files = []) {
        this.id = notice.id;
        this.author = notice.author;
        this.title = notice.title;
        this.content = notice.content;
        this.files = Array.isArray(files) ? files : [];
        this.count = notice.count;
        this.created_at = notice.created_at;
    }
}

module.exports = NoticeResponseDto;