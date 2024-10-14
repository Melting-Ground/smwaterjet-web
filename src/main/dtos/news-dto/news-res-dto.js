class NewsResponseDto {
    constructor({ id, url, title, content, media, published_at, created_at }) {
        this.id = id
        this.url = url;
        this.title = title;
        this.content = content;
        this.media = media;
        this.published_at = published_at;
        this.created_at = created_at;
    }
}

module.exports = NewsResponseDto;