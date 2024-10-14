class NewsDto {
    constructor({ url, title, content, media, published_at }) {
        this.url = url;
        this.title = title;
        this.content = content;
        this.media = media;
        this.published_at = published_at;
    }
}

module.exports = NewsDto;