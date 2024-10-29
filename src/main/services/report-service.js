const db = require('@configs/knex');
const Report = require("@models/report/report");
const ReportResDto = require("@dtos/report-dto/report-res-dto");
const Exception = require('@exceptions/exception');
const fileDeleteUtil = require('@utils/file-delete-util');
const createSearchQuery = require('@utils/search-query-builder');

class ReportService {
    static async getAllReports(pagination) {
        const offset = pagination.getOffset();
        const limit = pagination.limit;

        const reports = await db('reports').limit(limit).offset(offset);
        const reportResDtos = reports.map(report => new ReportResDto(report));
        return reportResDtos;
    }

    static async getReportById(id) {
        const report = await db('reports').where({ id }).first();
        if (report == null) {
            throw new Exception('ValueNotFoundException', 'Report is not found');
        }
        const reportFiles = await db('report_files').where({ report_id: id });
        const reportResDto = new ReportResDto(report, reportFiles);
        return reportResDto;
    }

    static async searchReports(pagination, searchParams) {
        const offset = pagination.getOffset();
        const limit = pagination.limit;

        let reportsQuery = createSearchQuery('reports', searchParams);
        const reports = await reportsQuery.limit(limit).offset(offset);
        const reportResDtos = reports.map(report => new ReportResDto(report));

        return reportResDtos;
    }

    static async editReport(id, reportDto, reportFileDto) {
        const report = await db('reports').where({ id }).first();
        const filePaths = reportFileDto.paths.map(file => file.path);
        const updateReport = new Report(reportDto);
        if (report == null) {
            throw new Exception('ValueNotFoundException', 'Report is not found');
        }
        await db('reports').where({ id }).update(updateReport);

        if (reportFileDto.isNotEmpty()) {
            const fileInsertPromises = filePaths.map(async (path) => {
                return await db('report_files').insert({
                    report_id: id,
                    file_path: path,
                });
            });
            await Promise.all(fileInsertPromises);
        }
        return new ReportResDto(updateReport, filePaths);
    }

    static async createReport(reportDto, reportFileDto) {
        const newReport = new Report(reportDto);
        const filePaths = reportFileDto.paths.map(file => file.path);
        const [insertedId] = await db('reports').insert(newReport);

        if (reportFileDto.isNotEmpty()) {
            const fileInsertPromises = filePaths.map(async (path) => {
                return await db('report_files').insert({
                    report_id: insertedId,
                    file_path: path,
                });
            });
            await Promise.all(fileInsertPromises);
        }
        return new ReportResDto(newReport, filePaths);
    }

    static async deleteReport(id) {
        const report = await db('reports').where({ id }).first();
        if (report == null) {
            throw new Exception('ValueNotFoundException', 'Report is not found');
        }
        const filePaths = await db('report_files').where({ report_id: id }).select('file_path');
        for (const file of filePaths) {
            try {
                await fileDeleteUtil.deleteFile(file.file_path);
            } catch (error) {
                console.error(`Failed to delete file at ${file.file_path}:`, error);
            }
        }
        await db('report_files').where({ report_id: id }).del();
        await db('reports').where({ id }).del();
    }

    static async deleteFile(id) {
        const file = await db('report_files').where({ id }).select('file_path').first();
        if (file == null) {
            throw new Exception('ValueNotFoundException', 'ReportFile is not found');
        }
        const filePath = file.file_path;

        await db('report_files').where({ id }).del();

        await fileDeleteUtil.deleteFile(filePath);
    }
}

module.exports = ReportService;


