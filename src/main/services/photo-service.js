const db = require('@configs/knex');
const Photo = require("@models/photo");
const PhotoResDto = require("@dtos/photo-dto/photo-res-dto");
const fileDeleteUtil = require('@utils/file-delete-util');
const Exception = require('@exceptions/exception');

class PhotoService {
    static async getAllPhotos(pagination) {
        const offset = pagination.getOffset();
        const limit = pagination.limit;

        const totalItemsResult = await db('photos').count('id as count').first();
        const totalCount = totalItemsResult.count;

        const photos = await db('photos').limit(limit).offset(offset);
        const photoResDtos = photos.map(photo => new PhotoResDto(photo));
        return {
            items: photoResDtos,
            pagination: pagination.getPaginationInfo(totalCount),
        };
    }

    static async getPhotoById(id) {
        const photo = await db('photos').where({ id }).first();
        if (photo == null) {
            throw new Exception('ValueNotFoundException', 'Photo is not found');
        }
        return new PhotoResDto(photo);
    }

    static async getPhotosByYear(year, pagination) {
        const offset = pagination.getOffset();
        const limit = pagination.limit;

        const totalItemsResult = await db('photos').where({ year: year }).count('id as count').first();
        const totalCount = totalItemsResult.count;

        const photos = await db('photos').where({ year: year }).limit(limit).offset(offset);
        const photoResDtos = photos.map(photo => new PhotoResDto(photo));
        return {
            items: photoResDtos,
            pagination: pagination.getPaginationInfo(totalCount),
        };
    }

    static async createPhoto(photoDto) {
        const newPhoto = new Photo(photoDto);
        await db('photos').insert(newPhoto);
        return new PhotoResDto(newPhoto);
    }

    static async editPhoto(id, photoDto) {
        const photo = await db('photos').where({ id }).first();
        const updatePhoto = new Photo(photoDto);

        if (photo == null) {
            throw new Exception('ValueNotFoundException', 'Photo is not found');
        }
        await db('photos').where({ id }).update(updatePhoto);
        return new PhotoResDto(updatePhoto);
    }

    static async deletePhoto(id) {
        const photo = await db('photos').where({ id }).first();
        if (photo == null) {
            throw new Exception('ValueNotFoundException', 'Photo is not found');
        }
        const filePath = photo.path;
        await fileDeleteUtil.deleteFile(filePath);

        await db('photos').where({ id }).del();
    }
}

module.exports = PhotoService;