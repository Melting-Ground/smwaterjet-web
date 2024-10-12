class InquiryFileResponseDto {
    constructor({id, inquiryId, path}){
        this.id = id;
        this.inquiryId = inquiryId;
        this.path = path;
    }
}

module.exports = InquiryFileResponseDto