class InquiryDto {
    constructor({username, password, phone_number, email, title, content}) {
        this.username = username;
        this.password = password;
        this.phone_number = phone_number;
        this.email = email;
        this.title = title;
        this.content = content;
    }
}

module.exports = InquiryDto;s