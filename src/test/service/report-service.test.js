const db = require('@configs/knex');
const ReportResDto = require('@dtos/report-dto/report-res-dto');
const ReportService = require('@services/report-service');

jest.mock('@configs/knex');

describe('ReportService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllReports', () => {
        it('전체 실적현황 조회', async () => {
            const mockReports = [
                { id: 1, title: 'title1', year: 2024, start_date: '2024-11-11', end_date: '2024-12-12' },
                { id: 2, title: 'title2', year: 2024, start_date: '2024-11-11', end_date: '2024-12-12' },
            ];
            db.mockResolvedValue(mockReports);
            const result = await ReportService.getAllReports();
            expect(result).toHaveLength(mockReports.length);
            expect(result[0]).toBeInstanceOf(ReportResDto);
        });
    });

    describe('getReportById', () => {
        it('id로 실적현황 조회', async () => {
            const mockReport = { id: 1, title: 'title1', year: 2024, start_date: '2024-11-11', end_date: '2024-12-12' };
            db.mockImplementation(() => ({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(mockReport)
            }));
            const result = await ReportService.getReportById(1);
            expect(result).toBeInstanceOf(ReportResDto);
            expect(result).toEqual(new ReportResDto(mockReport));
        });

        it('id의 실적현황 없을 경우', async () => {
            const mockReport = { id: 1, title: 'title1', year: 2024, start_date: '2024-11-11', end_date: '2024-12-12' };

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
            const mockReport = { id: 1, title: 'title1', year: 2024 };
            const reportDto = { title: 'title1', year: 2024 };

            db.mockImplementation(() => ({
                insert: jest.fn().mockResolvedValue([mockReport.id])
            }));
            const result = await ReportService.createReport(reportDto);
            expect(result).toBeInstanceOf(ReportResDto);
            expect(result.title).toEqual(new ReportResDto(reportDto).title);
        });
    });

    describe('deleteReport', () => {
        it('id로 등록된 실적현황 삭제', async () => {
            const mockReport = { id: 1, title: 'title1', year: 2024, start_date: '2024-11-11', end_date: '2024-12-12' };
            db.mockImplementation(() => ({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(mockReport),
                del: jest.fn().mockResolvedValue()
            }));
            await ReportService.deleteReport(1);
        });

        it('id의 실적현황 없을 경우', async () => {
            const mockReport = { id: 1, title: 'title1', year: 2024, start_date: '2024-11-11', end_date: '2024-12-12' };
            db.mockImplementation(() => ({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(null),
            }));
            await expect(ReportService.deleteReport(999)).rejects.toThrow('Report is not found');
        });
    });
});