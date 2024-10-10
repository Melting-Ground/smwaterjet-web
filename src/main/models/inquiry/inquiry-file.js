class InquiryFile {
    constructor({ id, inquiry_id, file_title, file_path }) {
        this.id = id;
        this.inquiry_id = inquiry_id;
        this.file_title = file_title;
        this.file_path = file_path;
    }
}

module.exports = InquiryFile;