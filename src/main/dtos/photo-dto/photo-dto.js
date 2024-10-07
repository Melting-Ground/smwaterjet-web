class PhotoDto{
  constructor({ title, content, year, path }) {
    this.title = title;
    this.content = content;
    this.year = year;
    this.path = path;
  }
}

module.exports = PhotoDto;