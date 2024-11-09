const db = require('@configs/knex');
const InquiryService = require('@services/inquiry-service');
const InquiryResDto = require('@dtos/inquiry-dto/inquiry-res-dto');
const InquiryPublicResDto = require('@dtos/inquiry-dto/inquiry-public-res-dto');
const fileDeleteUtil = require('@utils/file-delete-util');
const argon2 = require('argon2');
const createSearchQuery = require('@utils/search-query-builder');
const Pagination = require('@utils/pagination');
const SearchParameters = require('@utils/search-parameters');

jest.mock('@configs/knex');
jest.mock('@utils/file-delete-util');
jest.mock('argon2');
jest.mock('@utils/search-query-builder');

describe('InquiryService', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getAllInquiries', () => {
		it('전체 질의사항 조회', async () => {
			const mockInquiries = [
				{ id: 1, title: 'title1' },
				{ id: 2, title: 'title2' }
			];
			db.mockImplementation(() => ({
				limit: jest.fn().mockReturnThis(),
				offset: jest.fn().mockResolvedValue(mockInquiries),
			}));
			const paigination = new Pagination(1,10);

			const result = await InquiryService.getAllInquiries(paigination);

			expect(db).toHaveBeenCalledWith('inquiries');
			expect(result).toEqual(mockInquiries.map(inquiry => new InquiryPublicResDto(inquiry)));
		});
	});

	describe('getInquiryById', () => {
		it('id로 질의사항 조회', async () => {
			const mockInquiry = { id: 1, title: 'title1' };
			const mockInquiryFiles = [{ id: 1, inquiry_id: 1, file_path: 'file1' }];
			db.mockImplementation((tableName) => {
				if (tableName === 'inquiries') {
					return {
						where: jest.fn().mockReturnValueOnce({
							first: jest.fn().mockResolvedValue(mockInquiry),
						}),
					};
				} else if (tableName === 'inquiry_files') {
					return {
						where: jest.fn().mockReturnValueOnce(mockInquiryFiles),
					};
				}
			});

			const result = await InquiryService.getInquiryById(1);

			expect(result).toEqual(new InquiryResDto(mockInquiry, mockInquiryFiles));
		});

		it('id의 질의사항 없을 경우 예외처리', async () => {
			db.mockImplementation(() => ({
				where: jest.fn().mockReturnThis(),
				first: jest.fn().mockResolvedValue(null),
			}));
			await expect(InquiryService.getInquiryById(1)).rejects.toThrow('Inquiry is not found');
		});
	});

	describe('searchInquiries', () => {
		it('질의사항 검색 기능', async () => {
			const mockInquiries = [{ id: 1, title: 'title1' }];
			const mockSearchQuery = { limit: jest.fn().mockReturnThis(), offset: jest.fn().mockResolvedValue(mockInquiries) };
			createSearchQuery.mockReturnValue(mockSearchQuery);
			const paigination = new Pagination(1,10);
			const searchParams = new SearchParameters('tet','all');

			const result = await InquiryService.searchInquiries(paigination, searchParams);
			expect(result).toEqual(mockInquiries.map(inquiry => new InquiryPublicResDto(inquiry)));
		});
	});

	describe('createInquiry', () => {
		it('새로운 질의사항 생성', async () => {
			const mockDto = { title: 'New Inquiry', password: 'password1234' };
			const mockHashedPassword = 'hashedPassword';
			const mockFilesDto = { isNotEmpty: jest.fn().mockReturnValue(false), paths: [] };

			argon2.hash.mockResolvedValue(mockHashedPassword);
			db.mockImplementation(() => ({
				insert: jest.fn().mockResolvedValue([1]),
			}));
			const result = await InquiryService.createInquiry(mockDto, mockFilesDto);

			expect(argon2.hash).toHaveBeenCalledWith(mockDto.password);
			expect(db).toHaveBeenCalledWith('inquiries');
			expect(result).toBeInstanceOf(InquiryResDto);
		});
	});

	describe('editInquiry', () => {
		it('등록된 질의사항 수정', async () => {
			const mockInquiry = { id: 1, title: 'title1' };
			const mockDto = { title: 'New title' };
			const mockFilesDto = { isNotEmpty: jest.fn().mockReturnValue(false), paths: [] };

			db.mockImplementation(() => ({
				where: jest.fn().mockReturnThis(),
				first: jest.fn().mockResolvedValue(mockInquiry),
				update: jest.fn().mockResolvedValue(null),
			}));
			const result = await InquiryService.editInquiry(1, mockDto, mockFilesDto);

			expect(result).toBeInstanceOf(InquiryResDto);
		});

		it('id의 질의사항 없을 경우 예외처리', async () => {
			db.mockImplementation(() => ({
				where: jest.fn().mockReturnThis(),
				first: jest.fn().mockResolvedValue(null),
			}));
			await expect(InquiryService.editInquiry(1, {}, {})).rejects.toThrow('Inquiry is not found');
		});
	});

	describe('deleteInquiry', () => {
		it('등록된 질의사항 삭제', async () => {
			const mockInquiry = { id: 1, title: 'title1' };
			const mockInquiryFiles = [
				{ file_path: 'path1' },
				{ file_path: 'path2' }
			];

			db.mockImplementation((table) => {
				if (table === 'inquiries') {
					return {
						where: jest.fn().mockReturnValue({
							first: jest.fn().mockResolvedValue(mockInquiry),
							del: jest.fn().mockResolvedValue(1),
						}),
					};
				} else if (table === 'inquiry_files') {
					return {
						where: jest.fn().mockReturnValue({
							select: jest.fn().mockResolvedValue(mockInquiryFiles),
							del: jest.fn().mockResolvedValue(mockInquiryFiles.length),
						}),
					};
				}
			});

			await InquiryService.deleteInquiry(1);
			expect(fileDeleteUtil.deleteFile).toHaveBeenCalledTimes(mockInquiryFiles.length);
			expect(db).toHaveBeenCalledWith('inquiry_files');
			expect(db).toHaveBeenCalledWith('inquiries');
		});
	});

	describe('deleteFile', () => {
		it('파일 id로 등록된 파일 삭제', async () => {
			const mockFile = { file_path: 'path1' };

			db.mockImplementationOnce(() => ({
				where: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnThis(),
				first: jest.fn().mockResolvedValue(mockFile)
			}));

			await InquiryService.deleteFile(1);

			expect(db).toHaveBeenCalledWith('inquiry_files');
			expect(fileDeleteUtil.deleteFile).toHaveBeenCalledWith(mockFile.file_path);
		});

		it('해당 파일이 없을 경우 예외처리', async () => {
			db.mockImplementationOnce(() => ({
				where: jest.fn().mockReturnThis(),
				select: jest.fn().mockReturnThis(),
				first: jest.fn().mockResolvedValue(null)
			}));

			await expect(InquiryService.deleteFile(1)).rejects.toThrow('InquiryFile is not found');
		});
	});
});
