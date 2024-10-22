const db = require('@configs/knex');
const NewsResDto = require("@dtos/news-dto/news-res-dto");
const News = require("@models/news");
const Exception = require('@exceptions/exceptions');

class NewsService {
    static async getAllNews(pagination) {
        const offset = pagination.getOffset();
        const limit = pagination.limit;

        const news = await db('news').limit(limit).offset(offset);
        const newsResDtos = news.map(news => new NewsResDto(news));
        return newsResDtos;
    }

    static async createNews(newsDto) {
        const newNews = new News(newsDto);
        await db('news').insert(newNews);
        return new NewsResDto(newNews);
    }

    static async editNews(id, newsDto) {
        const news = await db('news').where({ id }).first();
        if (news == null) {
            throw new Exception('ValueNotFoundException', 'News is not found');
        }
        const updateNews = new News(newsDto);

        await db('news').where({ id }).update(updateNews);

        return new NewsResDto(updateNews);
    }

    static async deleteNews(id) {
        const isDeleted = await db('news').where({ id }).del();
        if (isDeleted == 0) {
            throw new Exception('ValueNotFoundException', 'News is not found');
        }
    }
}

module.exports = NewsService;