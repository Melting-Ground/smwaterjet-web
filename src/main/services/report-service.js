const db = require('@configs/knex');
const Report = require("@models/report/report");
const ReportResDto = require("@dtos/report-dto/report-res-dto");
const Exception = require('@exceptions/exception');

class ReportService {
    static async getAllReports() {
        const reports = await db('reports');
        const reportResDtos = reports.map(report => new ReportResDto(report));
        return reportResDtos;
    }

    static async getReportById(id) {
        const report = await db('reports').where({ id }).first();
        if (report == null) {
            throw new Exception('ValueNotFoundException', 'Report is not found');
        }
        const reportResDto = new ReportResDto(report);
        return reportResDto;
    }

    static async getReportByYear(year) {
        const reports = await db('reports').where({ year: year });
        const reportResDtos = reports.map(report => new ReportResDto(report));
        return reportResDtos;
    }

    static async editReport(id, reportDto) {
        const report = await db('reports').where({ id }).first();
        if (report == null) {
            throw new Exception('ValueNotFoundException', 'Report is not found');
        }
        const updateReport = new Report(reportDto);
        await db('reports').where({ id }).update(updateReport);
        return new ReportResDto(updateReport);
    }

    static async createReport(reportDto) {
        const newReport = new Report(reportDto);
        const [insertedId] = await db('reports').insert(newReport);
        return new ReportResDto({id: insertedId, ...newReport});
    }

    static async deleteReport(id) {
        const report = await db('reports').where({ id }).first();
        if (report == null) {
            throw new Exception('ValueNotFoundException', 'Report is not found');
        }
        await db('reports').where({ id }).del();
    }
}

module.exports = ReportService;


