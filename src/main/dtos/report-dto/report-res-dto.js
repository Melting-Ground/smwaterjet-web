class ReportResponseDto {
    constructor(report, files = []) {
        this.id = report.id;
        this.author = report.author;
        this.title = report.title;
        this.content = report.content;
        this.files = Array.isArray(files) ? files : [];
        this.uploaded_at = report.uploaded_at;
    }
}

module.exports = ReportResponseDto;