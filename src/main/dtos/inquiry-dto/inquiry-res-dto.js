class InquiryResponseDto {
    constructor(inquiry) {
        this.idd = inquiry.id;
        this.username = inquiry.username;
        this.password = inquiry.password;
        this.phone_number = inquiry.phone_number;
        this.email = inquiry.email;
        this.title = inquiry.title;
        this.content = inquiry.content;
        this.created_at = inquiry.created_at;
    }
}

module.exports = InquiryResponseDto;