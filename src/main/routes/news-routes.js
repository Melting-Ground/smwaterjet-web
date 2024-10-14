const express = require('express');
const authenticate = require('@middlewares/jwt-authentication');
const NewsController = require('@controllers/news-controller');

const router = express.Router();

router.get('/', NewsController.getAllNews);

router.post('/', authenticate, NewsController.createNews);

router.put('/:newsId', authenticate, NewsController.editNews);

router.delete('/:newsId', authenticate, NewsController.deleteNews);

module.exports = router;