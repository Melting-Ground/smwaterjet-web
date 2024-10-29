const db = require('@configs/knex');
const CertiResDto = require('@dtos/certificate-dto/certificate-res-dto');
const Certificate = require('@models/certificate');
const fileDeleteUtil = require('@utils/file-delete-util');
const CertificateService = require('@services/certificate-service');

jest.mock('@configs/knex');
jest.mock('@utils/file-delete-util');

describe('CertificateService', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getAllCertificates', () => {
		it('전체 인증서 조회', async () => {
			const mockCertificates = [
				{ id: 1, path: 'path1' },
				{ id: 2, path: 'path2' },
			];
			db.mockResolvedValue(mockCertificates);

			const result = await CertificateService.getAllCertificates();
			expect(result).toHaveLength(2);
			expect(result[0]).toBeInstanceOf(CertiResDto);
		});
	});

	describe('getCertificateById', () => {
		it('id로 인증서 조회', async () => {
			const mockCertificate = { id: 1, path: 'path1' };
			db.mockImplementation(() => ({
				where: jest.fn().mockReturnThis(),
				first: jest.fn().mockResolvedValue(mockCertificate),
			}));

			const result = await CertificateService.getCertificateById(1);
			expect(result).toEqual(new CertiResDto(mockCertificate));
		});

		it('id의 인증서가 없을 경우 오류 발생', async () => {
			db.mockImplementation(() => ({
				where: jest.fn().mockReturnThis(),
				first: jest.fn().mockResolvedValue(null),
			}));
			await expect(CertificateService.getCertificateById(999)).rejects.toThrow('Certificate is not found');
		});
	});

	describe('createCertificate', () => {
		it('새로운 인증서 생성', async () => {
			const mockCertificateDto = { path: 'path1' };
			const mockNewCertificate = new Certificate(mockCertificateDto);

			db.mockImplementation(() => ({
				insert: jest.fn().mockResolvedValue(),
			}));

			const result = await CertificateService.createCertificate(mockCertificateDto);
			expect(result.path).toEqual(mockNewCertificate.path);
		});
	});

	describe('deleteCertificate', () => {
		it('id로 인증서 삭제', async () => {
			const mockCertificate = { id: 1, path: 'path1' };
			db.mockImplementation(() => ({
				where: jest.fn().mockReturnThis(),
				first: jest.fn().mockResolvedValue(mockCertificate),
				del: jest.fn().mockResolvedValue(1),
			}));

			fileDeleteUtil.deleteFile.mockResolvedValue();

			await CertificateService.deleteCertificate(1);

			expect(fileDeleteUtil.deleteFile).toHaveBeenCalledWith(mockCertificate.path);
		});

		it('id의 인증서가 없을 경우 예외 처리', async () => {
			db.mockImplementation(() => ({
				where: jest.fn().mockReturnThis(),
				first: jest.fn().mockResolvedValue(null),
			}));

			await expect(CertificateService.deleteCertificate(999)).rejects.toThrow('Certificate is not found');
		});
	});
});