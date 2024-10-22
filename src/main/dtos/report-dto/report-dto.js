class ReportDto {
    constructor({ username, title, content }) {
        this.username = username;
        this.title = title;
        this.content = content;
    }
}

module.exports = ReportDto;