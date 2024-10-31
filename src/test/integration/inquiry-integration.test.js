const request = require('supertest');
const express = require('express');
const InquiryController = require('@controllers/inquiry-controller');
const InquiryService = require('@services/inquiry-service');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/inquiries', InquiryController.getAllInquiries);
app.get('/inquiries/:inquiryId', InquiryController.getInquiryById);
app.post('/inquiries', InquiryController.createInquiry);
app.put('/inquiries/:inquiryId', InquiryController.editInquiry);
app.delete('/inquiries/:inquiryId', InquiryController.deleteInquiry);
app.delete('/inquiries/file/:inquiryFileId', InquiryController.deleteFile);

jest.mock('@services/inquiry-service');

describe('InquiryController Integration Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /inquiries', () => {
        it('전체 질의사항 조회 및 200 리턴', async () => {
            const mockData = [{ id: 1, title: 'title1' }, { id: 2, title: 'title2' }];
            InquiryService.getAllInquiries.mockResolvedValue(mockData);

            const res = await request(app).get('/inquiries');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockData);
        });
    });

    describe('GET /inquiries/:inquiryId', () => {
        it('id로 질의사항 조회', async () => {
            const mockData = { id: 1, title: 'title1' };
            InquiryService.getInquiryById.mockResolvedValue(mockData);

            const res = await request(app).get('/inquiries/1');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockData);
        });

        it('id의 질의사항이 없을 경우 오류 발생', async () => {
            InquiryService.getInquiryById.mockRejectedValue(new Error('Inquiry is not found'));

            const res = await request(app).get('/inquiries/999');
            expect(res.statusCode).toBe(500);
        });
    });

    describe('POST /inquiries', () => {
        it('새로운 질의사항 생성', async () => {
            const mockData = { id: 1, title: 'New Inquiry' };
            InquiryService.createInquiry.mockResolvedValue(mockData);

            const res = await request(app).post('/inquiries').send({ title: 'New Inquiry' });

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual(mockData);
        });

        it('질의사항 생성 중 오류 발생 시 처리', async () => {
            InquiryService.createInquiry.mockRejectedValue(new Error('Error creating inquiry'));

            const res = await request(app).post('/inquiries').send({ title: 'New Inquiry' });

            expect(res.statusCode).toBe(500);
        });
    });

    describe('PUT /inquiries/:inquiryId', () => {
        it('등록된 질의사항 수정', async () => {
            const mockData = { id: 1, title: 'Updated Inquiry' };
            InquiryService.editInquiry.mockResolvedValue(mockData);

            const res = await request(app).put('/inquiries/1').send({ title: 'Updated Inquiry' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockData);
        });

        it('질의사항 수정 중 오류 발생', async () => {
            InquiryService.editInquiry.mockRejectedValue(new Error('Error updating inquiry'));

            const res = await request(app).put('/inquiries/999').send({ title: 'Nonexistent Inquiry' });
            expect(res.statusCode).toBe(500);
        });
    });

    describe('DELETE /inquiries/:inquiryId', () => {
        it('등록된 질의사항 삭제', async () => {
            InquiryService.deleteInquiry.mockResolvedValue();

            const res = await request(app).delete('/inquiries/1');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'Inquiry deleted successfully' });
        });

        it('id의 질의사항이 없을 경우 오류 발생', async () => {
            InquiryService.deleteInquiry.mockRejectedValue(new Error('Error deleting inquiry'));

            const res = await request(app).delete('/inquiries/999');
            expect(res.statusCode).toBe(500);
        });
    });

    describe('DELETE /inquiries/file/:inquiryFileId', () => {
        it('파일 id로 등록되 파일 삭제', async () => {
            InquiryService.deleteFile.mockResolvedValue();

            const res = await request(app).delete('/inquiries/file/1');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'InquiryFile deleted successfully' });
        });

        it('id로 등록된 파일이 없을 경우 오류 발생', async () => {
            InquiryService.deleteFile.mockRejectedValue(new Error('Error deleting inquiry file'));

            const res = await request(app).delete('/inquiries/file/999');
            expect(res.statusCode).toBe(500);
        });
    });
});