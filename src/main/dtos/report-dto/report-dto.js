class ReportDto {
    constructor({ title, start_date, end_date, note }) {
        this.title = title;
        this.start_date = start_date;
        this.end_date = end_date;
        this.note = note;
    }
}

module.exports = ReportDto;