const db = require('@configs/knex');
const Report = require('@models/report/report');
const ReportResDto = require('@dtos/report-dto/report-res-dto');
const Exception = require('@exceptions/exceptions');
const ReportService = require('@services/report-service');
const ReportFileDto = require('../../main/dtos/report-dto/report-file-dto');
const fileDeleteUtil = require('@utils/file-delete-util');

jest.mock('@utils/file-delete-util');
jest.mock('@configs/knex');

describe('ReportService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllReports', () => {
        it('전체 실적현황 조회', async () => {
            const mockReports = [
                { id: 1, title: 'title1', content: 'content1', year: 2024 },
                { id: 2, title: 'title2', content: 'content2', year: 2024 },
            ];
            db.mockImplementation(() => ({
                limit: jest.fn().mockReturnThis(),
                offset: jest.fn().mockResolvedValue(mockReports),
            }));

            const result = await ReportService.getAllReports(1, 10);
            expect(result).toHaveLength(mockReports.length);
            expect(result[0]).toBeInstanceOf(ReportResDto);
        });
    });

    describe('getReportById', () => {
        it('id로 실적현황 조회', async () => {
            const mockReport = { id: 1, title: 'title1', content: 'content1', year: 2024 };
            const mockReportFiles = [
                { id: 1, report_id: 1, file_path: 'path1' },
                { id: 2, report_id: 1, file_path: 'path2' },
            ];

            db.mockImplementation((tableName) => {
                if (tableName === 'reports') {
                    return {
                        where: jest.fn().mockReturnValueOnce({
                            first: jest.fn().mockResolvedValue(mockReport),
                        }),
                    };
                } else if (tableName === 'report_files') {
                    return {
                        where: jest.fn().mockReturnValueOnce(mockReportFiles),
                    };
                }
            });
            const result = await ReportService.getReportById(1);
            expect(result).toBeInstanceOf(ReportResDto);
            expect(result).toEqual(new ReportResDto(mockReport, mockReportFiles));
        });

        it('id의 실적현황 없을 경우', async () => {
            const mockReport = { id: 1, title: 'title1', content: 'content1', year: 2024 };

            db.mockImplementation(() => ({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(null)
            }));
            const reportId = 999;
            await expect(ReportService.getReportById(reportId)).rejects.toThrow('Report is not found');
        });
    });
    
    describe('createReport', () => {
        it('새로운 실적현황 생성', async () => {

        });
    });
});