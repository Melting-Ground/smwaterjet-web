class NoticeListResponseDto {
	constructor({row_num, id, author, title, count, created_at}) {
		this.row_num = row_num;
		this.id = id;
		this.author = author;
		this.title = title;
		this.count = count;
		this.created_at = created_at;
	}
}

module.exports = NoticeListResponseDto;