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
        try {
            const filePaths = req.files ? req.files.map(file => file.path) : [];
            const inquiryDto = new InquiryDto(req.body);
            const inquiryFileDto = new InquiryFileDto(filePaths);
            const inquiryResDto = await inquiryService.createInquiry(inquiryDto, inquiryFileDto);

            res.status(201).json(inquiryResDto);
        } catch (error) {
            next(error);
        }
    }
    static async editInquiry(req, res, next) {
        try {
            const { inquiryId } = req.params;
            const filePaths = req.files ? req.files.map(file => file.path) : [];
            const inquiryDto = new InquiryDto(req.body);
            const inquiryFileDto = new InquiryFileDto(filePaths);

            const inquiryResDto = await inquiryService.editInquiry(inquiryId, inquiryDto, inquiryFileDto);

            res.status(200).json(inquiryResDto);
        } catch {
            next(error);
        }
    }
    static async deleteInquiry(req, res, next) {
        try {
            const { inquiryId } = req.params;
            await inquiryService.deleteInquiry(inquiryId);

            res.status(200).json({ message: 'Inquiry deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async deleteFile(req, res, next) {
        try {
            const { inquiryFileId } = req.params;
            await inquiryService.deleteFile(inquiryFileId);

            res.status(200).json({ message: 'InquiryFile deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = InquiryController;