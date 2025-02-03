const ReportDto = require('@dtos/report-dto/report-dto');
const ReportService = require('@services/report-service');
const Pagination = require('@utils/pagination');

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

    static async getReportByYear(req, res, next) {
        try {
            const pagination = new Pagination(req.query.page, req.query.limit);
            const { year } = req.params;
            const reportResDtos = await ReportService.getReportByYear(year, pagination);
            res.status(200).json(reportResDtos);
        } catch (error) {
            next(error);
        }
    }

    static async editReport(req, res, next) {
        try {
            const { reportId } = req.params;
            const reportDto = new ReportDto(req.body);
            const reportResDto = await ReportService.editReport(reportId, reportDto);

            res.status(200).json(reportResDto);
        } catch (error) {
            next(error);
        }
    }

    static async createReport(req, res, next) {
        try {
            const reportDto = new ReportDto(req.body);
            const reportResDto = await ReportService.createReport(reportDto);

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
}

module.exports = ReportController;