class ReportResonseDto {
    constructor(report) {
        this.id = report.id;
        this.title = report.title;
        this.content = report.content;
        this.year = report.year;
        this.path = report.path;
        this.uploaded_at = report.uploaded_at;
    }
}

module.exports = ReportResonseDto;