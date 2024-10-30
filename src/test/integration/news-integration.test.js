const request = require('supertest');
const express = require('express');
const NewsController = require('@controllers/news-controller');
const NewsService = require('@services/news-service');

const app = express();
app.use(express.json());

app.get('/news', NewsController.getAllNews);
app.post('/news', NewsController.createNews);
app.put('/news/:newsId', NewsController.editNews);
app.delete('/news/:newsId', NewsController.deleteNews);

jest.mock('@services/news-service');

describe('NewsController Integration Tests', () => {
	describe('GET /news', () => {
		it('전체 뉴스 목록 조회', async () => {
			const mockNewsList = [
				{ id: 1, title: 'title1', content: 'content1' },
				{ id: 2, title: 'title2', content: 'content2' },
			];
			NewsService.getAllNews.mockResolvedValue(mockNewsList);

			const res = await request(app).get('/news');
			expect(res.statusCode).toBe(200);
			expect(res.body).toEqual(mockNewsList);
		});
	});

	describe('POST /news', () => {
		it('새로운 뉴스 생성', async () => {
			const mockNews = { title: 'New Title', content: 'New Content' };
			NewsService.createNews.mockResolvedValue(mockNews);

			const res = await request(app).post('/news').send(mockNews);
			expect(res.statusCode).toBe(201);
			expect(res.body).toEqual(mockNews);
		});

		it('생성 과정에서 오류 발생 시 처리', async () => {
			NewsService.createNews.mockRejectedValue(new Error('Error creating news'));

			const res = await request(app).post('/news').send({});
			expect(res.statusCode).toBe(500);
		});
	});

	describe('PUT /news/:newsId', () => {
		it('기존의 뉴스 업데이트', async () => {
			const mockNews = { id: 1, title: 'title1', content: 'content1' };
			NewsService.editNews.mockResolvedValue(mockNews);

			const res = await request(app).put(`/news/1`).send({ title: 'Updated title' });
			expect(res.statusCode).toBe(200);
		});

		it('업데이트 과정에서 오류 발생 시 처리', async () => {
			NewsService.editNews.mockRejectedValue(new Error('Error updating news'));

			const res = await request(app).put(`/news/999}`).send({});
			expect(res.statusCode).toBe(500);
		});
	});

	describe('DELETE /news/:newsId', () => {
		it('기존의 뉴스 삭제', async () => {
			NewsService.deleteNews.mockResolvedValue();

			const res = await request(app).delete(`/news/1}`);
			expect(res.statusCode).toBe(200);
			expect(res.body).toEqual({ message: 'News deleted successfully' });
		});

		it('삭제 과정에서 오류 발생 시 처리', async () => {
			NewsService.deleteNews.mockRejectedValue(new Error('Error deleting news'));

			const res = await request(app).delete(`/news/999}`);
			expect(res.statusCode).toBe(500);
		});
	});
});