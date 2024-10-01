class ReportResonseDto {
    constructor(report, reportContent) {
        this.id = report.id;
        this.title = report.report_title;
        this.year = report.report_year;
        this.content = reportContent;
        this.uploaded_at = report.uploaded_at;
    }
  }
  
  module.exports = ReportResonseDto;