const db = require('@configs/knex');
const ReportResDto = require('@dtos/report-dto/report-res-dto');
const ReportService = require('@services/report-service');
const ReportFileDto = require('@dtos/report-dto/report-file-dto');
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
            const mockReport = { id: 1, title: 'title1', content: 'content1', year: 2024 };
            const mockReportFiles = [
                { id: 1, report_id: 1, file_path: 'path1' },
                { id: 2, report_id: 1, file_path: 'path2' },
            ];
            const reportDto = { title: 'title1', content: 'content1', year: 2024 };
            const reportFileDto = new ReportFileDto([
                { report_id: 1, file_path: 'path1' },
                { report_id: 1, file_path: 'path2' },
            ]);
            const insertedId = 1;

            db.mockImplementation((tableName) => {
                if (tableName === 'reports') {
                    return {
                        insert: jest.fn().mockResolvedValue([insertedId]),
                    };
                } else if (tableName === 'report_files') {
                    return {
                        insert: jest.fn().mockResolvedValue([]),
                    };
                }
            });
            const result = await ReportService.createReport(reportDto, reportFileDto);
            expect(result).toBeInstanceOf(ReportResDto);
            expect(result).toEqual(new ReportResDto(reportDto, reportFileDto.paths));
        });
    });

    describe('deleteReport', () => {
        it('id로 등록된 실적현황 삭제', async () => {
            const mockReport = { id: 1, title: 'title1', content: 'content1', year: 2024 };
            const mockReportFiles = [
                { file_path: 'path1' },
                { file_path: 'path2' },
            ];

            db.mockImplementation((table) => {
                if (table === 'reports') {
                    return {
                        where: jest.fn().mockReturnValue({
                            first: jest.fn().mockResolvedValue(mockReport),
                            del: jest.fn().mockResolvedValue(1),
                        }),
                    };
                } else if (table === 'report_files') {
                    return {
                        where: jest.fn().mockReturnValue({
                            select: jest.fn().mockResolvedValue(mockReportFiles),
                            del: jest.fn().mockResolvedValue(mockReportFiles.length),
                        }),
                    };
                }
            });
            fileDeleteUtil.deleteFile = jest.fn().mockResolvedValue();
            await ReportService.deleteReport(1);
            expect(fileDeleteUtil.deleteFile).toHaveBeenCalledWith('path1');
            expect(fileDeleteUtil.deleteFile).toHaveBeenCalledWith('path2');
        });
        it('id의 실적현황 없을 경우', async () => {
            const mockReport = { id: 1, title: 'title1', content: 'content1', year: 2024 };
            db.mockImplementation(() => ({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(null),
            }));
            await expect(ReportService.deleteReport(999)).rejects.toThrow('Report is not found');
        });
    });
    describe('deleteFile', () => {
        it('fileId로 파일 삭제', async () => {
            const mockReportFiles = { id: 1, report_id: 1, file_path: 'path1'};
            db.mockImplementation(() => ({
                where: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(mockReportFiles),
                del: jest.fn().mockResolvedValue(1),
            }));

            fileDeleteUtil.deleteFile = jest.fn().mockResolvedValue();
            await ReportService.deleteFile(1);
            expect(fileDeleteUtil.deleteFile).toHaveBeenCalledWith('path1');
        });
    });
});