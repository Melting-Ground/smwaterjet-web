class ReportDto {
    constructor({ title, year, start_date, end_date, note }) {
        this.title = title;
        this.year = year;
        this.start_date = start_date;
        this.end_date = end_date;
        this.note = note;
    }
}

module.exports = ReportDto;