const db = require('@configs/knex');
const Report = require("@models/report/report");
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
        if (report == null) {
            throw new Exception('ValueNotFoundException', 'Report not found');
        }
        const reportFiles = await db('report_files').where({ report_id: id });
        return new ReportResDto(report, reportFiles);
    }

    static async getReportByYear(year) {
        const reports = await db('reports').where({ year: year });
        const reportResDtos = reports.map(cert => new ReportResDto(cert));
        return reportResDtos;
    }

    static async createReport(reportDto, reportFileDto) {
        const newReport = new Report(reportDto);
        const result = await db('reports').insert(newReport);
        const insertedId = result[0];

        if (reportFileDto.isNotEmpty()) {
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
        const filePaths = await db('report_files').where({ report_id: id }).select('file_path');

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


