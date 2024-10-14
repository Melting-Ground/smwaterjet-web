const NewsDto = require("@dtos/news-dto/news-dto");
const NewsService = require('@services/news-service');

class NewsController {
    static async getAllNews(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            const newsResDtos = await NewsService.getAllNews(page, limit);
            res.status(200).json(newsResDtos);
        } catch (error) {
            next(error);
        }
    }

    static async createNews(req, res, next) {
        try {
            const newsDto = new NewsDto(req.body);
            const newsResDto = await NewsService.createNews(newsDto);

            res.status(201).json(newsResDto);
        } catch (error) {
            next(error);
        }
    }

    static async editNews(req, res, next) {
        try {
            const { newsId } = req.params;
            const newsDto = new NewsDto(req.body);

            const newsResDto = await NewsService.editNotice(newsId, newsDto);

            res.status(200).json(newsResDto);
        } catch {
            next(error);
        }
    }

    static async deleteNews(req, res, next) {
        try {
            const { newsId } = req.params;
            await NewsService.deleteNews(newsId);

            res.status(200).json({ message: 'News deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = NewsController;