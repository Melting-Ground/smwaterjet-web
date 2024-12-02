const request = require('supertest');
const express = require('express');
const ReportController = require('@controllers/report-controller');
const ReportService = require('@services/report-service');

const app = express();
app.use(express.json());

app.get('/reports', ReportController.getAllReports);
app.get('/reports/year/:year', ReportController.getReportByYear);
app.get('/reports/:reportId', ReportController.getReportById);
app.post('/reports', ReportController.createReport);
app.put('/reports/:reportId', ReportController.editReport);
app.delete('/reports/:reportId', ReportController.deleteReport);

jest.mock('@services/report-service');

describe('ReportController Integration Tests', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('GET /reports', () => {
		it('전체 실적현황 목록 조회', async () => {
			const mockReports = [
				{ id: 1, title: 'title1', year: 2024, start_date: '2024-11-11', end_date: '2024-12-12' },
				{ id: 2, title: 'title2', year: 2024, start_date: '2024-11-11', end_date: '2024-12-12' },
			];
			ReportService.getAllReports.mockResolvedValue(mockReports);

			const res = await request(app).get('/reports');
			expect(res.statusCode).toBe(200);
			expect(res.body).toEqual(mockReports);
		});
	});

	describe('GET /reports/year/:year', () => {
		it('실적현황 검색 결과 반환', async () => {
			const mockSearchResults = [
				{ id: 1, title: 'title1', year: 2024, start_date: '2024-11-11', end_date: '2024-12-12' }
			];
			ReportService.getReportByYear.mockResolvedValue(mockSearchResults);

			const res = await request(app).get('/reports/year/2024');
			expect(res.statusCode).toBe(200);
			expect(res.body).toEqual(mockSearchResults);
		});
	});

	describe('GET /reports/:reportId', () => {
		it('ID로 실적현황 조회', async () => {
			const mockReport = { id: 1, title: 'title1', year: 2024, start_date: '2024-11-11', end_date: '2024-12-12' };
			ReportService.getReportById.mockResolvedValue(mockReport);

			const res = await request(app).get('/reports/1');
			expect(res.statusCode).toBe(200);
		});

		it('존재하지 않는 ID로 실적현황 조회 시 오류 처리', async () => {
			ReportService.getReportById.mockRejectedValue(new Error('Report not found'));

			const res = await request(app).get('/reports/999');
			expect(res.statusCode).toBe(500);
		});
	});

	describe('POST /reports', () => {
		it('새로운 실적현황 생성', async () => {
			const mockReport = { title: 'title1', year: 2024 };
			ReportService.createReport.mockResolvedValue(mockReport);

			const res = await request(app).post('/reports').send({ title: 'title1', year: 2024 });
			expect(res.statusCode).toBe(201);
		});

		it('실적현황 생성 과정에서 오류 발생 시 처리', async () => {
			ReportService.createReport.mockRejectedValue(new Error('Error creating report'));

			const res = await request(app).post('/reports').send({});
			expect(res.statusCode).toBe(500);
		});
	});

	describe('PUT /reports/:reportId', () => {
		it('기존 실적현황 업데이트', async () => {
			const mockReport = { id: 1, title: 'title1', year: 2024, start_date: '2024-11-11', end_date: '2024-12-12' };
			ReportService.editReport.mockResolvedValue(mockReport);

			const res = await request(app).put('/reports/1').send({ title: 'Updated title' });
			expect(res.statusCode).toBe(200);
			expect(res.body).toEqual(mockReport);
		});

		it('실적현황 업데이트 과정에서 오류 발생 시 처리', async () => {
			ReportService.editReport.mockRejectedValue(new Error('Error updating report'));

			const res = await request(app).put('/reports/999').send({});
			expect(res.statusCode).toBe(500);
		});
	});

	describe('DELETE /reports/:reportId', () => {
		it('기존 실적현황 삭제', async () => {
			ReportService.deleteReport.mockResolvedValue();

			const res = await request(app).delete('/reports/1');
			expect(res.statusCode).toBe(200);
			expect(res.body).toEqual({ message: 'Report deleted successfully' });
		});

		it('실적현황 삭제 과정에서 오류 발생 시 처리', async () => {
			ReportService.deleteReport.mockRejectedValue(new Error('Error deleting report'));

			const res = await request(app).delete('/reports/999');
			expect(res.statusCode).toBe(500);
		});
	});
});