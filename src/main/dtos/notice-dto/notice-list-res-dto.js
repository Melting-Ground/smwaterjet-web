class NoticeListResponseDto {
	constructor({id, author, title, count, created_at}) {
		this.id = id;
		this.author = author;
		this.title = title;
		this.count = count;
		this.created_at = created_at;
	}
}

module.exports = NoticeListResponseDto;