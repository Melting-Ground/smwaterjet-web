const db = require('@configs/knex');
const Report = require("@models/report");
const ReportResDto = require("@dtos/report-dto/report-res-dto");
const Exception = require('@exceptions/exceptions');
const folderDeleteUtil = require('@utils/folder-delete-util');

class ReportService {
    static async getAllReports(page,limit) {
        const offset = (page - 1) * limit;
        const reports = await db('reports').limit(limit).offset(offset); 
        const reportResDtos = reports.map(cert => new ReportResDto(cert));
        return reportResDtos;
    }

    static async getReportById(id) {
        const report = await db('reports').where({ id }).first(); 
        if (report == null) {
            throw new Exception('ValueNotFoundException','Report not found');
        }
        return new ReportResDto(report);
    }

    static async getReportByYear(year) {
        const reports = await db('photos').where({ year: year}); 
        const reportResDtos = reports.map(cert => new ReportResDto(cert));
        return reportResDtos;
    }
    
    static async createReport(reportDto) {
        const newReport = new Report(reportDto);
        await db('photos').insert(newReport);
        return new ReportResDto(newReport);
    }

    static async deleteReport(id) {
        const report = await db('reports').where({ id }).first();
        if (report == null) {
            throw new Exception('ValueNotFoundException', 'Report not found');
        }
        const fordlerPath = report.path;
        await folderDeleteUtil.deleteDirectory(fordlerPath);

        const isDeleted = await db('reports').where({ id }).del();
        if(isDeleted == 0){
            throw new Exception('ValueNotFoundException','Report not found');
        }
    }
}

module.exports = ReportService;


