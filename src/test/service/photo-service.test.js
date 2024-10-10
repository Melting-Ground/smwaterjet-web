const PhotoService = require('@services/photo-service');
const db = require('@configs/knex');
const Photo = require('@models/photo');
const PhotoResDto = require('@dtos/photo-dto/photo-res-dto');
const fileDeleteUtil = require('@utils/file-delete-util');
const Exception = require('@exceptions/exceptions');

jest.mock('@configs/knex');
jest.mock('@utils/file-delete-util');

describe('PhotoService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllPhotos', () => {
        it('return a list of photoResDtos', async () => {
            const mockPhotos = [
                { id: 1, title: 'title1', content: 'content1', year: 2024, path: 'paht1' },
                { id: 2, title: 'title2', content: 'content2', year: 2024, path: 'paht2' }];
            db.mockReturnValueOnce(mockPhotos);

            const result = await PhotoService.getAllPhotos();

            expect(result).toEqual(mockPhotos.map(photo => new PhotoResDto(photo)));
        });
    });

    describe('getPhotoById', () => {
        it('return a photoResDto when photo is found', async () => {
            const mockPhoto = { id: 1, title: 'title1', content: 'content1', year: 2024, path: 'paht1' };
            db.mockReturnValueOnce({ where: jest.fn().mockReturnThis(), first: jest.fn().mockResolvedValue(mockPhoto) });

            const result = await PhotoService.getPhotoById(1);

            expect(result).toEqual(new PhotoResDto(mockPhoto));
        });

        it('throw an Exception when photo is not found', async () => {
            db.mockReturnValueOnce({ where: jest.fn().mockReturnThis(), first: jest.fn().mockResolvedValue(null) });

            await expect(PhotoService.getPhotoById(999)).rejects.toThrow('Photo not found');
        });
    });

    describe('createPhoto', () => {
        it('create a new photo and return photoResDto', async () => {
            const photoDto = { title: 'New Title', content: 'New Content', year: 2024, path: 'New Path' };
            const newPhoto = new Photo(photoDto);
            db.mockReturnValueOnce({ insert: jest.fn().mockResolvedValue(newPhoto) });

            const result = await PhotoService.createPhoto(newPhoto);

            expect(result).toEqual(new PhotoResDto(newPhoto));
        });
    });
    describe('deletePhoto', () => {
        it('delete a photo and its file when photo is found', async () => {
            const mockPhoto = { title: 'title1', content: 'content1', year: 2024, path: 'paht1' };
            const mockDb = {
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue(mockPhoto),
                del: jest.fn().mockResolvedValue(1)
            };
            db.mockReturnValue(mockDb);

            fileDeleteUtil.deleteFile.mockResolvedValue(); 

            await PhotoService.deletePhoto(1); 

            expect(fileDeleteUtil.deleteFile).toHaveBeenCalledWith(mockPhoto.path); 
            expect(db().where).toHaveBeenCalledWith({ id: 1 }); 
        });

        it('throw an Exception when photo is not found', async () => {
            db.mockReturnValueOnce({ where: jest.fn().mockReturnThis(), first: jest.fn().mockResolvedValue(null) });

            await expect(PhotoService.deletePhoto(999)).rejects.toThrow('Photo not found');
        });

        it('throw an Exception if deletion fails', async () => {
            const mockPhoto = { id: 1, path: 'path/to/photo1' };
            db.mockReturnValueOnce({ where: jest.fn().mockReturnThis(), first: jest.fn().mockResolvedValue(mockPhoto) });
            db.mockReturnValueOnce({ where: jest.fn().mockReturnThis(), del: jest.fn().mockResolvedValue(0) }); 

            await expect(PhotoService.deletePhoto(1)).rejects.toThrow('Photo not found');
        });
    });
});
