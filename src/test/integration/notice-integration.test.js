const request = require('supertest');
const express = require('express');
const NoticeController = require('@controllers/notice-controller');
const NoticeService = require('@services/notice-service');

const app = express();
app.use(express.json());

app.get('/notices', NoticeController.getAllNotices);
app.get('/notices/search', NoticeController.searchNotices);
app.get('/notices/:noticeId', NoticeController.getNoticeById);
app.post('/notices', NoticeController.createNotice);
app.put('/notices/:noticeId', NoticeController.editNotice);
app.delete('/notices/:noticeId', NoticeController.deleteNotice);

jest.mock('@services/notice-service');

describe('NoticeController Integration Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /notices', () => {
        it('전체 공지 목록 조회', async () => {
            const mockNotices = [
                { id: 1, title: 'title1', content: 'content1' },
                { id: 2, title: 'title2', content: 'content2' },
            ];
            NoticeService.getAllNotices.mockResolvedValue(mockNotices);
            const res = await request(app).get('/notices');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockNotices);
        });
    });

    describe('GET /notices/search', () => {
        it('공지 검색 결과 반환', async () => {
            const mockSearchResults = [
                { id: 1, title: 'title query', content: 'content1' },
            ];
            NoticeService.searchNotices.mockResolvedValue(mockSearchResults);

            const res = await request(app).get('/notices/search').query({ query: 'query', searchBy: 'title' });
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockSearchResults);
        });

        it('검색 중 오류 발생 시 처리', async () => {
            NoticeService.searchNotices.mockRejectedValue(new Error('Error searching notices'));

            const res = await request(app).get('/notices/search').query({ query: 'Error' });
            expect(res.statusCode).toBe(500);
        });
    });

    describe('GET /notices/:noticeId', () => {
        it('ID로 공지 조회', async () => {
            const mockNotice = { id: 1, title: 'title1', content: 'content1' };
            NoticeService.getNoticeById.mockResolvedValue(mockNotice);
            const res = await request(app).get('/notices/1');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockNotice);
        });

        it('존재하지 않는 ID로 공지 조회 시 오류 처리', async () => {
            NoticeService.getNoticeById.mockRejectedValue(new Error('Notice not found'));

            const res = await request(app).get('/notices/999');
            expect(res.statusCode).toBe(500);
        });
    });

    describe('POST /notices', () => {
        it('새로운 공지 생성', async () => {
            const mockNotice = { title: 'New Notice', content: 'New Content' };
            NoticeService.createNotice.mockResolvedValue(mockNotice);

            const res = await request(app).post('/notices').send({ title: 'New Notice', content: 'New Content' });
            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual(mockNotice);
        });

        it('공지 생성 과정에서 오류 발생 시 처리', async () => {
            NoticeService.createNotice.mockRejectedValue(new Error('Error creating notice'));

            const res = await request(app).post('/notices').send({});
            expect(res.statusCode).toBe(500);
        });
    });

    describe('PUT /notices/:noticeId', () => {
        it('기존 공지 업데이트', async () => {
            const mockNotice = { id: 1, title: 'Updated Notice', content: 'Updated Content' };
            NoticeService.editNotice.mockResolvedValue(mockNotice);

            const res = await request(app).put('/notices/1').send({ title: 'Updated Notice' });
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockNotice);
        });

        it('공지 업데이트 과정에서 오류 발생 시 처리', async () => {
            NoticeService.editNotice.mockRejectedValue(new Error('Error updating notice'));

            const res = await request(app).put('/notices/999').send({});
            expect(res.statusCode).toBe(500);
        });
    });

    describe('DELETE /notices/:noticeId', () => {
        it('기존 공지 삭제', async () => {
            NoticeService.deleteNotice.mockResolvedValue();

            const res = await request(app).delete('/notices/1');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'Notice deleted successfully' });
        });

        it('공지 삭제 과정에서 오류 발생 시 처리', async () => {
            NoticeService.deleteNotice.mockRejectedValue(new Error('Error deleting notice'));
            const res = await request(app).delete('/notices/999');
            expect(res.statusCode).toBe(500);
        });
    });
});