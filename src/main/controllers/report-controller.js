const ReportDto = require('@dtos/report-dto/report-dto');
const reportService = require('@services/report-service');
const ReportContentDto = require('@dtos/report-dto/report-content-dto');


class ReportController {
    static async getAllReports (req, res, next) {
        try {
            const reportResDtos = await reportService.getAllReports();
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

    static async createReport(req, res, next) {
        try {
            const reportDto = new ReportDto(req.body);
            const reportContentDto = ReportContentDto(req.body.content);
            const reportResDto = await reportService.createReport(reportDto,reportContentDto);
     
            res.status(201).json(reportResDto);
        } catch (error) {
            next(error); 
        }
    }

    static async deleteReport (req, res, next) {
        try {
            const { reportId } = req.params;
            await reportService.deleteReport(reportId);

            res.status(200).json({ message: 'Report deleted successfully' });
        } catch (error) {
            next(error); 
        }
    }

    static async uploadFile(req, res, next) {
        try {
            const filePath = req.file.path; 
            res.status(201).json(filePath);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ReportController;