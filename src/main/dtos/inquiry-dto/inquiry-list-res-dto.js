class InquiryListResponseDto {
    constructor(inquiry) {
        this.id = inquiry.id;
        this.author = inquiry.author;
        this.title = inquiry.title;
        this.created_at = inquiry.created_at;
    }
}

module.exports = InquiryListResponseDto;