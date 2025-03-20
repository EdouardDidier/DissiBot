module.exports = class SongInfo {
  constructor(url, info, author) {
    this.title = info.title;
    this.url = url;
    this.id = info.video_id;

    this.length_seconds = info.length_seconds;
    this.startTime = null;
    this.pauseTime = null;

    this.author = author;
  }
}
