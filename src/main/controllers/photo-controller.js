const PhotoDto = require("dtos/photo-dto/photo-dto");
const photoService = require("services/photo-service");

class PhotoController {
    static async getAllPhotos(req, res, next) {
        try {
            const photoResDtos = await photoService.getAllPhotos();
            res.status(200).json(photoResDtos);
        } catch (error) {
            next(error); 
        }
    }
    static async getPhotoById(req, res, next) {
        try {
            const { photoId } = req.params;
            const photoResDto = await photoService.getPhotoById(photoId);
            res.status(200).json(photoResDto);
        } catch (error) {
            next(error); 
        }
    }

    static async getPhotosByYear(req, res, next) {
        try {
            const { year } = req.params;
            const photoResDtos = await photoService.getPhotosByYear(photoId);
            res.status(200).json(photoResDtos);
        } catch (error) {
            next(error); 
        }
    }

    static async createPhoto(req, res, next) {
        try {
            const filePath = req.file.path;
    
            res.status(201).json();
        } catch (error) {
            next(error); 
        }
    }

    static async deletePhoto (req, res, next) {
        try {
            const { photoId } = req.params;
            await photoService.deletePhoto(photoId);

            res.status(200).json({ message: 'Photo deleted successfully' });
        } catch (error) {
            next(error); 
        }
    }
}

module.exports = PhotoController;
