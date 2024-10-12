const express = require('express');
const photoController = require('@controllers/photo-controller');
const authenticate = require('@middlewares/jwt-auth-middleware');
const creatMulter = require("@configs/multer-config");

const upload = creatMulter('photos');

const router = express.Router();

router.get('/', photoController.getAllPhotos);
router.get('/:photoId', photoController.getPhotoById);
router.get('/year/:year', photoController.getPhotosByYear);
router.post('/', authenticate, upload.single('file'), photoController.createPhoto);
router.delete('/:photoId', authenticate, photoController.deletePhoto);

module.exports = router;