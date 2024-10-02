const express = require('express');
const photoController = require('@controllers/photo-controller');
const authenticate = require('@middlewares/jwt-auth-middleware')
const creatMulter = require("@configs/multer-config")

const uploadPhoto = creatMulter('photos')

const router = express.Router();

router.get('/photos', photoController.getAllPhotos);
router.get('/photos/:photoId', photoController.getPhotoById);
router.get('/photos/year/:year', photoController.getPhotosByYear);
router.post('/photos', authenticate, uploadPhoto.single('file'), photoController.createPhoto);
router.delete('/photos/:photoId', authenticate, photoController.deletePhoto);

module.exports = router;