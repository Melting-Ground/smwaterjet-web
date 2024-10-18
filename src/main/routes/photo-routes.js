const express = require('express');
const PhotoController = require('@controllers/photo-controller');
const authenticate = require('@middlewares/jwt-authentication');
const creatMulter = require("@configs/multer-config");

const upload = creatMulter('photos');

const router = express.Router();

router.get('/', PhotoController.getAllPhotos);

router.get('/:photoId', PhotoController.getPhotoById);

router.get('/year/:year', PhotoController.getPhotosByYear);

router.put('/:photoId', authenticate, PhotoController.editPhoto);

router.post('/', authenticate, upload.single('file'), PhotoController.createPhoto);

router.delete('/:photoId', authenticate, PhotoController.deletePhoto);

module.exports = router;