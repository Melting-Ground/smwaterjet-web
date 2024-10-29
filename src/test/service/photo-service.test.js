const PhotoService = require('@services/photo-service');
const db = require('@configs/knex');
const PhotoResDto = require('@dtos/photo-dto/photo-res-dto');
const fileDeleteUtil = require('@utils/file-delete-util');

jest.mock('@configs/knex');
jest.mock('@utils/file-delete-util');

describe('PhotoService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllPhotos', () => {
        it('전체 작업 사진 조회', async () => {
            const mockPhotos = [
                { id: 1, title: 'title1', content: 'content1', year: 2024, path: 'path1' },
                { id: 2, title: 'title2', content: 'content2', year: 2024, path: 'path1' },
            ];
            db.mockResolvedValue(mockPhotos);

            const result = await PhotoService.getAllPhotos();
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(PhotoResDto);
            expect(result[1]).toBeInstanceOf(PhotoResDto);
        });
    });

    describe('getPhotoById', () => {
        it('id로 사진 조회', async () => {
            const mockPhoto = { id: 1, title: 'title1', content: 'content1', year: 2024, path: 'path1' };

            db.mockImplementation(() => ({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(mockPhoto)
            }));

            const photoId = 1;
            const result = await PhotoService.getPhotoById(photoId);
            expect(result).toEqual(mockPhoto);
            expect(result).toBeInstanceOf(PhotoResDto);
        });

        it('id의 사진이 없을 경우 예외 처리', async () => {
            db.mockImplementation(() => ({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(null)
            }));
            const photoId = 999;
            await expect(PhotoService.getPhotoById(photoId)).rejects.toThrow('Photo is not found');
        });
    });

    describe('createPhoto', () => {
        it('새로운 사진 생성', async () => {
            const mockPhotoDto = { title: 'title1', content: 'content1', year: 2024, path: 'path1' };
            const mockPhoto = { id: 1, title: 'title1', content: 'content1', year: 2024, path: 'path1' };

            db.mockImplementation(() => ({
                insert: jest.fn().mockResolvedValue([mockPhoto.id])
            }));

            const result = await PhotoService.createPhoto(mockPhotoDto);
            expect(result).toBeInstanceOf(PhotoResDto);
            expect(result.title).toEqual(mockPhotoDto.title);
        });
    });
    describe('deletePhoto', () => {
        it('id로 등록된 사진 삭제', async () => {
            const mockPhoto = { id: 1, title: 'title1', content: 'content1', year: 2024, path: 'path1' };
            db.mockImplementation(() => ({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(mockPhoto),
                del: jest.fn().mockResolvedValue()
            }));
            fileDeleteUtil.deleteFile = jest.fn().mockResolvedValue();
            await PhotoService.deletePhoto(1);

            expect(fileDeleteUtil.deleteFile).toHaveBeenCalledWith(mockPhoto.path);
        });

        it('id의 사진이 없을 경우 예외 처리', async () => {
            const mockPhoto = { id: 1, title: 'title1', content: 'content1', year: 2024, path: 'path1' };

            db.mockImplementation(() => ({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(null),
            }));

            await expect(PhotoService.deletePhoto(999)).rejects.toThrow('Photo is not found');
        });

        it('사진 삭제가 실패한 경우 예외 처리', async () => {
            const mockPhoto = { id: 1, title: 'title1', content: 'content1', year: 2024, path: 'path1' };

            db.mockImplementation(() => ({
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(mockPhoto),
                del: jest.fn().mockResolvedValue(undefined),
            }));
            fileDeleteUtil.deleteFile = jest.fn().mockRejectedValue(new Error('Could not delete the file'));

            await expect(PhotoService.deletePhoto(999)).rejects.toThrow('Could not delete the file');
            expect(db().del).not.toHaveBeenCalled();
        });
    });
});
