const request = require('supertest');
const express = require('express');
const PhotoController = require('@controllers/photo-controller');
const PhotoService = require('@services/photo-service');

const app = express();
app.use(express.json());

app.get('/photos', PhotoController.getAllPhotos);
app.get('/photos/year/:year', PhotoController.getPhotosByYear);
app.get('/photos/:photoId', PhotoController.getPhotoById);
app.post('/photos', PhotoController.createPhoto);
app.put('/photos/:photoId', PhotoController.editPhoto);
app.delete('/photos/:photoId', PhotoController.deletePhoto);

jest.mock('@services/photo-service');

describe('PhotoController Integration Tests', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('GET /photos', () => {
		it('전체 사진 목록 조회', async () => {
			const mockPhotos = [
				{ id: 1, title: 'title1', year: 2023 },
				{ id: 2, title: 'title2', year: 2024 },
			];
			PhotoService.getAllPhotos.mockResolvedValue(mockPhotos);

			const res = await request(app).get('/photos');
			expect(res.statusCode).toBe(200);
			expect(res.body).toEqual(mockPhotos);
		});
	});

	describe('GET /photos/:photoId', () => {
		it('ID로 특정 사진 조회', async () => {
			const mockPhoto = { id: 1, title: 'title1', year: 2024 };
			PhotoService.getPhotoById.mockResolvedValue(mockPhoto);

			const res = await request(app).get('/photos/1');
			expect(res.statusCode).toBe(200);
			expect(res.body).toEqual(mockPhoto);
		});

		it('존재하지 않는 ID로 조회 시 오류 처리', async () => {
			PhotoService.getPhotoById.mockRejectedValue(new Error('Photo not found'));

			const res = await request(app).get('/photos/999');
			expect(res.statusCode).toBe(500);
		});
	});

	describe('GET /photos/year/:year', () => {
		it('연도로 사진 목록 조회', async () => {
			const mockPhotosByYear = [
				{ id: 1, title: 'title1', year: 2023 },
				{ id: 2, title: 'title2', year: 2024 },
			];
			PhotoService.getPhotosByYear.mockResolvedValue(mockPhotosByYear);

			const res = await request(app).get('/photos/year/2023');
			expect(res.statusCode).toBe(200);
			expect(res.body).toEqual(mockPhotosByYear);
		});

		it('존재하지 않는 연도로 조회 시 오류 처리', async () => {
			PhotoService.getPhotosByYear.mockRejectedValue(new Error('No photos found for the given year'));

			const res = await request(app).get('/photos/year/1234');
			expect(res.statusCode).toBe(500);
		});
	});

	describe('POST /photos', () => {
		it('사진 생성 과정에서 오류 발생 시 처리', async () => {
			PhotoService.createPhoto.mockRejectedValue(new Error('Error creating photo'));

			const res = await request(app).post('/photos').send({});
			expect(res.statusCode).toBe(500);
		});
	});

	describe('PUT /photos/:photoId', () => {
		it('기존 사진 업데이트', async () => {
			const mockPhoto = { id: 1, title: 'Updated Photo', year: 2023 };
			PhotoService.editPhoto.mockResolvedValue(mockPhoto);

			const res = await request(app).put('/photos/1').send({ title: 'Updated Photo' });
			expect(res.statusCode).toBe(200);
		});

		it('사진 업데이트 과정에서 오류 발생 시 처리', async () => {
			PhotoService.editPhoto.mockRejectedValue(new Error('Error updating photo'));

			const res = await request(app).put('/photos/999').send({});
			expect(res.statusCode).toBe(500);
		});
	});

	describe('DELETE /photos/:photoId', () => {
		it('기존 사진 삭제', async () => {
			PhotoService.deletePhoto.mockResolvedValue();

			const res = await request(app).delete('/photos/1');
			expect(res.statusCode).toBe(200);
			expect(res.body).toEqual({ message: 'Photo deleted successfully' });
		});

		it('사진 삭제 과정에서 오류 발생 시 처리', async () => {
			PhotoService.deletePhoto.mockRejectedValue(new Error('Error deleting photo'));

			const res = await request(app).delete('/photos/999');
			expect(res.statusCode).toBe(500);
		});
	});
});
