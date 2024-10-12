const db = require('@configs/knex');
const Report = require("@models/report");
const ReportResDto = require("@dtos/report-dto/report-res-dto");
const Exception = require('@exceptions/exceptions');
const fileDeleteUtil = require('@utils/file-delete-util');

class ReportService {
    static async getAllReports(page, limit) {
        const offset = (page - 1) * limit;
        const reports = await db('reports').limit(limit).offset(offset);
        const reportResDtos = reports.map(cert => new ReportResDto(cert));
        return reportResDtos;
    }

    static async getReportById(id) {
        const report = await db('reports').where({ id }).first();
        const reportfiles = await db('report_files').where({ report_id: id });

        if (report == null) {
            throw new Exception('ValueNotFoundException', 'Report not found');
        }
        return new ReportResDto(report,reportfiles);
    }

    static async getReportByYear(year) {
        const reports = await db('reports').where({ year: year });
        const reportResDtos = reports.map(cert => new ReportResDto(cert));
        return reportResDtos;
    }

    static async createReport(reportDto, reportFileDto) {
        const newReport = new Report(reportDto);
        const [insertedId] = await db('reports').insert(newReport).returning('id');

        if (!reportFileDto.isEmpty()) {
            const fileInsertPromises = reportFileDto.paths.map(async (path) => {
                return await db('report_files').insert({
                    report_id: insertedId,
                    path: path, 
                });
            });
            await Promise.all(fileInsertPromises);
        }
        return new ReportResDto(newReport);
    }

    static async deleteReport(id) {
        const report = await db('reports').where({ id }).first();
        if (report == null) {
            throw new Exception('ValueNotFoundException', 'Report not found');
        }
        const filePaths = await db('report_files').where({ report_id: id }).select('path');

        for (const file of filePaths) {
            try {
                await fileDeleteUtil.deleteFile(file.path);
            } catch (error) {
                console.error(`Failed to delete file at ${file.path}:`, error);
            }
        }
        await db('report_files').where({ report_id: id }).del();
        await db('reports').where({ id }).del();
    }
}

module.exports = ReportService;


