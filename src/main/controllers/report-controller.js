const ReportDto = require('@dtos/report-dto/report-dto');
const reportService = require('@services/report-service');
const ReportFileDto = require('@dtos/report-dto/report-file-dto');

class ReportController {
    static async getAllReports(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            const reportResDtos = await reportService.getAllReports(page, limit);
            res.status(200).json(reportResDtos);
        } catch (error) {
            next(error);
        }
    }
    static async getReportById(req, res, next) {
        try {
            const { reportId } = req.params;
            const reportResDto = await reportService.getReportById(reportId);
            res.status(200).json(reportResDto);
        } catch (error) {
            next(error);
        }
    }

    static async getReportByYear(req, res, next) {
        try {
            const { year } = req.params;
            const reportResDtos = await reportService.getReportByYear(year);
            res.status(200).json(reportResDtos);
        } catch (error) {
            next(error);
        }
    }

    static async createReport(req, res, next) {
        try {
            const filePaths = req.files ? req.files.map(file => file.path) : [];
            const reportDto = new ReportDto(req.body);
            const reportFileDto = new ReportFileDto(filePaths);
            const reportResDto = await reportService.createReport(reportDto, reportFileDto);

            res.status(201).json(reportResDto);
        } catch (error) {
            next(error);
        }
    }

    static async deleteReport(req, res, next) {
        try {
            const { reportId } = req.params;
            await reportService.deleteReport(reportId);

            res.status(200).json({ message: 'Report deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ReportController;