class InquiryListResponseDto {
    constructor({ id, author, title, created_at }) {
        this.id = id;
        this.author = author;
        this.title = title;
        this.created_at = created_at;
    }
}

module.exports = InquiryListResponseDto;