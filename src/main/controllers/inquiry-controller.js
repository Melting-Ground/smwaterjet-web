const InquiryDto = require('@dtos/inquiry-dto/inquiry-dto');
const InquiryFileDto = require('@dtos/inquiry-dto/inquiry-file-dto');
const inquiryService = require('@services/inquiry-service');

class InquiryController {
    static async getAllInquiries(req, res, next) {
        try {
            const inquiryResDtos = await inquiryService.getAllInquiries();
            res.status(200).json(inquiryResDtos);
        } catch (error) {
            next(error);
        }
    }
    static async getInquiryById(req, res, next) {
        try {
            const { inquiryId } = req.params;
            const inquiryResDto = await inquiryService.getInquiryById(inquiryId);
            res.status(200).json(inquiryResDto);
        } catch (error) {
            next(error);
        }
    }
    static async createInquiry(req, res, next) {
        
    }
    static async editInquiry(req, res, next) {

    }
    static async deleteInquiry(req, res, next) {

    }
}