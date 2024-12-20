class ReportResponseDto {
    constructor({ row_num, id, title, year, start_date, end_date, note }) {
        this.row_num = row_num;
        this.id = id;
        this.title = title;
        this.year = year;
        this.start_date = start_date;
        this.end_date = end_date;
        this.note = note;
    }
}

module.exports = ReportResponseDto;