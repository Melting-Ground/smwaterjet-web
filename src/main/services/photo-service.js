const db = require('@configs/knex');
const Photo = require("@models/photo");
const PhotoResDto = require("@dtos/photo-dto/photo-res-dto");
const fileDeleteUtil = require('@utils/file-delete-util');
const Exception = require('@exceptions/exceptions');

class PhotoService {
    static async getAllPhotos() {
        const photos = await db('photos');
        const photoResDtos = photos.map(cert => new PhotoResDto(cert));
        return photoResDtos;
    }

    static async getPhotoById(id) {
        const photo = await db('photos').where({ id }).first();
        if (photo == null) {
            throw new Exception('ValueNotFoundException', 'Photo not found');
        }
        return new PhotoResDto(photo);
    }

    static async getPhotosByYear(year) {
        const photos = await db('photos').where({ year: year });
        const photoResDtos = photos.map(cert => new PhotoResDto(cert));
        return photoResDtos;
    }

    static async createPhoto(photoDto) {
        const newPhoto = new Photo(photoDto);
        await db('photos').insert(newPhoto);
        return new PhotoResDto(newPhoto);
    }

    static async deletePhoto(id) {
        const photo = await db('photos').where({ id }).first();
        if (photo == null) {
            throw new Exception('ValueNotFoundException', 'Photo not found');
        }
        const filePath = photo.path;
        await fileDeleteUtil.deleteFile(filePath);

        const isDeleted = await db('photos').where({ id }).del();
        if (isDeleted == 0) {
            throw new Exception('ValueNotFoundException', 'Photo not found');
        }
    }
}

module.exports = PhotoService;