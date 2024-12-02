const PhotoDto = require("@dtos/photo-dto/photo-dto");
const PhotoService = require("@services/photo-service");
const Pagination = require('@utils/pagination');

class PhotoController {
    static async getAllPhotos(req, res, next) {
        try {
            const pagination = new Pagination(req.query.page, req.query.limit);
            const photoResDtos = await PhotoService.getAllPhotos(pagination);
            res.status(200).json(photoResDtos);
        } catch (error) {
            next(error);
        }
    }
    
    static async getPhotoById(req, res, next) {
        try {
            const { photoId } = req.params;
            const photoResDto = await PhotoService.getPhotoById(photoId);
            res.status(200).json(photoResDto);
        } catch (error) {
            next(error);
        }
    }

    static async getPhotosByYear(req, res, next) {
        try {
            const pagination = new Pagination(req.query.page, req.query.limit);
            const { year } = req.params;
            const photoResDtos = await PhotoService.getPhotosByYear(year, pagination);
            res.status(200).json(photoResDtos);
        } catch (error) {
            next(error);
        }
    }

    static async editPhoto(req, res, next) {
        try {
            const { photoId } = req.params;
            const photoDto = new PhotoDto(req.body);

            const photoResDto = await PhotoService.editPhoto(photoId,photoDto);
            res.status(200).json(photoResDto);
        } catch (error) {
            next(error);
        }
    }

    static async createPhoto(req, res, next) {
        try {
            const filePath = req.file.path;
            const photoDto = new PhotoDto({
                ...req.body,
                path: filePath
            });

            const photoResDto = await PhotoService.createPhoto(photoDto);
            res.status(201).json(photoResDto);
        } catch (error) {
            next(error);
        }
    }

    static async deletePhoto(req, res, next) {
        try {
            const { photoId } = req.params;
            await PhotoService.deletePhoto(photoId);

            res.status(200).json({ message: 'Photo deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PhotoController;
