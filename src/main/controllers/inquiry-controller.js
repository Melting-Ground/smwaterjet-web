const InquiryDto = require('@dtos/inquiry-dto/inquiry-dto');
const InquiryFileDto = require('@dtos/inquiry-dto/inquiry-file-dto');
const InquiryService = require('@services/inquiry-service');

class InquiryController {
    static async getAllInquiries(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            const inquiryResDtos = await InquiryService.getAllInquiries(page, limit);
            res.status(200).json(inquiryResDtos);
        } catch (error) {
            next(error);
        }
    }

    static async getInquiryById(req, res, next) {
        try {
            const { inquiryId } = req.params;
            const inquiryResDto = await InquiryService.getInquiryById(inquiryId);
            res.status(200).json(inquiryResDto);
        } catch (error) {
            next(error);
        }
    }

    static async searchInquiries(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const query = req.query.query; 
            const searchBy = req.query.searchBy || 'all';

            const inquiryResDtos = await InquiryService.searchInquiries(query, page, limit, searchBy);
            res.status(200).json(inquiryResDtos);
        } catch (error) {
            next(error);
        }
    }

    static async createInquiry(req, res, next) {
        try {
            const filePaths = req.files ? req.files.map(file => file.path) : [];
            const inquiryDto = new InquiryDto(req.body);
            const inquiryFileDto = new InquiryFileDto(filePaths);
            const inquiryResDto = await InquiryService.createInquiry(inquiryDto, inquiryFileDto);

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

            const inquiryResDto = await InquiryService.editInquiry(inquiryId, inquiryDto, inquiryFileDto);

            res.status(200).json(inquiryResDto);
        } catch {
            next(error);
        }
    }

    static async deleteInquiry(req, res, next) {
        try {
            const { inquiryId } = req.params;
            await InquiryService.deleteInquiry(inquiryId);

            res.status(200).json({ message: 'Inquiry deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async deleteFile(req, res, next) {
        try {
            const { inquiryFileId } = req.params;
            await InquiryService.deleteFile(inquiryFileId);

            res.status(200).json({ message: 'InquiryFile deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = InquiryController;