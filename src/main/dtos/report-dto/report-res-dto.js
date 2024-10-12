class ReportResponseDto {
    constructor(report, files = null) {
        this.id = report.id;
        this.title = report.title;
        this.content = report.content;
        this.year = report.year;
        this.files = files;
        this.uploaded_at = report.uploaded_at;
    }
}

module.exports = ReportResponseDto;