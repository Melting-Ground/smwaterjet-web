class InquiryResponseDto {
    constructor({ id, author, phone_number, email, title, content, created_at }, files = []) {
        this.id = id;
        this.author = author;
        this.phone_number = phone_number;
        this.email = email;
        this.title = title;
        this.content = content;
        this.files = Array.isArray(files) ? files : [];
        this.created_at = created_at;
    }
}

module.exports = InquiryResponseDto;