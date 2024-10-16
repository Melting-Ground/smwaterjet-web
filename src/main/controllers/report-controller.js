const ReportDto = require('@dtos/report-dto/report-dto');
const ReportService = require('@services/report-service');
const ReportFileDto = require('@dtos/report-dto/report-file-dto');

class ReportController {
    static async getAllReports(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            const reportResDtos = await ReportService.getAllReports(page, limit);
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

    static async editReport(req, res, next) {
        try {
            const { reportId } = req.params;
            const filePaths = req.files ? req.files.map(file => file.path) : [];
            const reportDto = new ReportDto(req.body);
            const reportFileDto = new ReportFileDto(filePaths);

            const reportResDto = await NoticeService.editReport(reportId, reportDto, reportFileDto);

            res.status(200).json(reportResDto);
        } catch (error) {
            next(error);
        }
    }

    static async createReport(req, res, next) {
        try {
            const filePaths = req.files ? req.files.map(file => file.path) : [];
            const reportDto = new ReportDto(req.body);
            const reportFileDto = new ReportFileDto(filePaths);
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