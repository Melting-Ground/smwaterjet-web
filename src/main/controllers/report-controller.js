const ReportDto = require('@dtos/report-dto/report-dto');
const ReportService = require('@services/report-service');
const ReportFileDto = require('@dtos/report-dto/report-file-dto');
const Pagination = require('@utils/pagination');
const SearchParameters = require('@utils/search-parameters');

class ReportController {
    static async getAllReports(req, res, next) {
        try {
            const pagination = new Pagination(req.query.page, req.query.limit);
            const reportResDtos = await ReportService.getAllReports(pagination);
            res.status(200).json(reportResDtos);
        } catch (error) {
            next(error);
        }
    }

    static async getReportById(req, res, next) {
        try {
            const { reportId } = req.params;
            const reportResDto = await ReportService.getReportById(reportId);
            res.status(200).json(reportResDto);
        } catch (error) {
            next(error);
        }
    }

    static async searchReports(req, res, next) {
        try {
            const pagination = new Pagination(req.query.page, req.query.limit);
            const searchParams = new SearchParameters(req.query.query, req.query.searchBy);

            const reportResDtos = await ReportService.searchReports(pagination, searchParams);
            res.status(200).json(reportResDtos);
        } catch (error) {
            next(error);
        }
    }

    static async editReport(req, res, next) {
        try {
            const { reportId } = req.params;
            const reportDto = new ReportDto(req.body);
            const reportFileDto = new ReportFileDto(req.files);

            const reportResDto = await ReportService.editReport(reportId, reportDto, reportFileDto);

            res.status(200).json(reportResDto);
        } catch (error) {
            next(error);
        }
    }

    static async createReport(req, res, next) {
        try {
            const reportDto = new ReportDto(req.body);
            const reportFileDto = new ReportFileDto(req.files);
            const reportResDto = await ReportService.createReport(reportDto, reportFileDto);

            res.status(201).json(reportResDto);
        } catch (error) {
            next(error);
        }
    }

    static async deleteReport(req, res, next) {
        try {
            const { reportId } = req.params;
            await ReportService.deleteReport(reportId);

            res.status(200).json({ message: 'Report deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
    static async deleteFile(req, res, next) {
        try {
            const { reportFileId } = req.params;
            await ReportService.deleteFile(reportFileId);

            res.status(200).json({ message: 'ReportFile deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ReportController;