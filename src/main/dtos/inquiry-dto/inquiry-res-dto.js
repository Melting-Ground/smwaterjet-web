class InquiryResponseDto {
    constructor(inquiry, files = null) {
        this.id = inquiry.id;
        this.username = inquiry.username;
        this.phone_number = inquiry.phone_number;
        this.email = inquiry.email;
        this.title = inquiry.title;
        this.content = inquiry.content;
        this.files = files;
        this.created_at = inquiry.created_at;
    }
}

module.exports = InquiryResponseDto;