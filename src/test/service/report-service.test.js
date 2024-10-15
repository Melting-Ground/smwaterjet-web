const db = require('@configs/knex');
const Report = require('@models/report/report');
const ReportResDto = require('@dtos/report-dto/report-res-dto');
const Exception = require('@exceptions/exceptions');
const ReportService = require('@services/report-service');
const ReportFileDto = require('../../main/dtos/report-dto/report-file-dto');
const fileDeleteUtil = require('@utils/file-delete-util');


jest.mock('@configs/knex');
jest.mock('@utils/folder-delete-util');

describe('ReportService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getAllReports', () => {
        it('return list of ReportResDto', async () => {
            const mockReports = [
                { id: 1, title: 'Report1', content: 'Content1', year: 2024 },
                { id: 1, title: 'Report2', content: 'Content2', year: 2024 },
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
        const mockReport = { id: reportId, title: 'Report1', content: 'Content1', year: 2024 };

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
                { id: 1, title: 'Report1', content: 'Content1', year: 2024 },
                { id: 2, title: 'Report2', content: 'Content2', year: 2024 },
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
            const mockReportDto = { title: 'New Report', content: 'New Content', year: 2024 };
            const mockReportFileDto = new ReportFileDto('path1');
            const mockInsertedReport = new Report(mockReportDto);

            db.mockReturnValue({
                insert: jest.fn().mockResolvedValue([1]),
            });

            const result = await ReportService.createReport(mockInsertedReport, mockReportFileDto);

            expect(result).toBeInstanceOf(ReportResDto);
            expect(result.title).toBe(mockReportDto.title);
            expect(result.content).toBe(mockReportDto.content);
            expect(result.year).toBe(mockReportDto.year);
        });
    });
});