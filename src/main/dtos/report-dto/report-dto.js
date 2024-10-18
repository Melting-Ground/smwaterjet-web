class ReportDto {
    constructor({ username, title, content, year }) {
        this.username = username;
        this.title = title;
        this.content = content;
        this.year = year;
    }
}

module.exports = ReportDto;