const db = require('@configs/knex');
const Report = require('@models/report');
const ReportResDto = require('@dtos/report-dto/report-res-dto');
const Exception = require('@exceptions/exceptions');
const folderDeleteUtil = require('@utils/folder-delete-util');
const ReportService = require('@services/report-service');

jest.mock('@configs/knex');
jest.mock('@utils/folder-delete-util');

describe('ReportService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllReports', () => {
        it('return list of ReportResDto', async () => {
            const mockReports = [
                { id: 1, title: 'Report1', content: 'Content1', year: 2024, path: 'path1' },
                { id: 1, title: 'Report2', content: 'Content2', year: 2024, path: 'path2' },
            ];
            db.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                offset: jest.fn().mockReturnThis(),
                then: jest.fn((callback) => callback(mockReports)),
            });

            const page = 1;
            const limit = 2;
            const result = await ReportService.getAllReports(page, limit);

            expect(result).toHaveLength(mockReports.length);
            expect(result[0]).toBeInstanceOf(ReportResDto);
            expect(result[0].id).toBe(mockReports[0].id);
            expect(result[1].id).toBe(mockReports[1].id);
        });
    });
    describe('getReportById', () => {
        const reportId = 1;
        const mockReport = { id: reportId, title: 'Report1', content: 'Content1', year: 2024, path: 'path1' };

        it('return a ReportResDto when report is found', async () => {
            db.mockImplementation(() => ({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(mockReport),
            }));

            const result = await ReportService.getReportById(reportId);
            expect(result).toBeInstanceOf(ReportResDto);
            expect(result.id).toBe(mockReport.id);
            expect(result.title).toBe(mockReport.title);
        });

        it('throw an Exception when report is not found', async () => {
            db.mockImplementation(() => ({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(null),
            }));
            await expect(ReportService.getReportById(reportId)).rejects.toThrow('Report not found');
        });
    });
    describe('getReportByYear', () => {
        it('return list of ReportResDto by year', async () => {
            const mockReports = [
                { id: 1, title: 'Report1', content: 'Content1', year: 2024, path: 'path1' },
                { id: 2, title: 'Report2', content: 'Content2', year: 2024, path: 'path2' },
            ];

            db.mockReturnValue({
                where: jest.fn().mockResolvedValue(mockReports),
            });

            const year = 2024;
            const result = await ReportService.getReportByYear(year);

            expect(result).toHaveLength(mockReports.length);
            expect(result[0]).toBeInstanceOf(ReportResDto);
            expect(result[0].id).toBe(mockReports[0].id);
            expect(result[1].id).toBe(mockReports[1].id);
        });
    });

    describe('createReport', () => {
        it('create a new report and return ReportResDto', async () => {
            const mockReportDto = { title: 'New Report', content: 'New Content', year: 2024, path: 'New Path' };
            const mockInsertedReport = new Report(mockReportDto);

            db.mockReturnValue({
                insert: jest.fn().mockResolvedValue([1]),
            });

            const result = await ReportService.createReport(mockInsertedReport);

            expect(result).toBeInstanceOf(ReportResDto);
            expect(result.title).toBe(mockReportDto.title);
            expect(result.content).toBe(mockReportDto.content);
            expect(result.year).toBe(mockReportDto.year);
        });
    });
    describe('deleteReport', () => {
        it('delete a report and its directory when report is found', async () => {
            const mockReport = { id: 1, title: 'Report1', content: 'Content1', year: 2024, path: 'path/to/folder' };

            const mockDb = {
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(mockReport),
                del: jest.fn().mockResolvedValue(1)
            };

            db.mockReturnValue(mockDb);

            folderDeleteUtil.deleteDirectory.mockResolvedValue();

            const reportId = 1;
            await ReportService.deleteReport(reportId);

            expect(folderDeleteUtil.deleteDirectory).toHaveBeenCalledWith(mockReport.path);
            expect(db().where).toHaveBeenCalledWith({ id: reportId });
        });
    });
    it('throw an Exception when report is not found', async () => {
        const mockDb = {
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockResolvedValue(null),
        };

        db.mockReturnValue(mockDb);

        const reportId = 1;
        await expect(ReportService.deleteReport(reportId)).rejects.toThrow('Report not found');
    });
    it('throw an Exception if deletion fails', async () => {
        const mockReport = { id: 1, title: 'Report1', content: 'Content1', year: 2024, path: 'path/to/folder' };

        const mockDb = {
            where: jest.fn().mockReturnThis(),
            first: jest.fn().mockResolvedValue(mockReport),
            del: jest.fn().mockResolvedValue(0)
        };

        db.mockReturnValue(mockDb);

        folderDeleteUtil.deleteDirectory.mockResolvedValue();

        const reportId = 1;
        await expect(ReportService.deleteReport(reportId)).rejects.toThrow('Report not found');
    });
});