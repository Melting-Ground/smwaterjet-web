const request = require('supertest');
const express = require('express');
const CertificateController = require('@controllers/certificate-controller');
const CertificateService = require('@services/certificate-service');
const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

const app = express();
app.use(express.json());

app.get('/certificates', CertificateController.getAllCertificates);
app.get('/certificates/:certificateId', CertificateController.getCertificateById);
app.post('/certificates', upload.single('file'), CertificateController.createCertificate);
app.delete('/certificates/:certificateId', CertificateController.deleteCertificate);

jest.mock('@services/certificate-service');

describe('CertificateController Integration Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

	describe('GET /certificates', () => {
        it('회사가 보유한 전체 특허와 200 리턴', async () => {
            const mockData = [{ id: 1, path: 'path1' }, { id: 2, path: 'path2' }];
            CertificateService.getAllCertificates.mockResolvedValue(mockData); 

            const res = await request(app).get('/certificates');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockData); 
        });
    });

	describe('GET /certificates/:certificateId', () => {
        it('id로 특정 특허 조회', async () => {
            const mockData = { id: 1, path: 'path1' };
            CertificateService.getCertificateById.mockResolvedValue(mockData);

            const res = await request(app).get('/certificates/1');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockData);
        });

        it('id의 특허정보가 없을 경우 오류', async () => {
            CertificateService.getCertificateById.mockRejectedValue(new Error('Certificate not found'));

            const res = await request(app).get('/certificates/999');
            expect(res.statusCode).toBe(500);
        });
    });

	describe('POST /certificates', () => {
		it('새로운 특허 등록 및 201 리턴', async () => {
			const mockData = { id: 1, path: 'path/to/file1.pdf' };
			CertificateService.createCertificate.mockResolvedValue(mockData);
	
			const res = await request(app)
				.post('/certificates')
				.attach('file', Buffer.from('test content'), 'file1.pdf'); 
	
			expect(res.statusCode).toBe(201);
			expect(res.body).toEqual(mockData);
		});
	});

    describe('DELETE /certificates/:certificateId', () => {
        it('id로 특정 특허 삭제 및 200 리턴', async () => {
            CertificateService.deleteCertificate.mockResolvedValue();

            const res = await request(app).delete('/certificates/1');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: 'Certificate deleted successfully' });
        });
    });
});
