const ytdl = require("ytdl-core");

module.exports = class MusicPlayer {
  constructor(guild) {
    this.guild = guild;
    this.voiceChannel = null;

    this.queue = [];
    this.current = null;

    this.volume = 0.2;
    this.mode = "FREE";
    this.repeat = "NONE";
  }

  isConnected() {
    return this.guild.voiceConnection != null;
  }

  isPlaying() {
    return this.current != null;
  }

  getCurrent() {
    return this.current;
  }

  getQueue() {
    return this.queue;
  }

  getMode() {
    return this.mode;
  }

  setMode(mode) {
    if (mode == "FREE" || mode == "VOTE" || mode == "NONE") {
      this.mode = mode;
      return true;
    }

    return false;
  }

  getRepeat() {
    return this.repeat;
  }

  setRepeat(repeat) {
    if (repeat == "SONG" || repeat == "PLAYLIST" || repeat == "NONE") {
      this.repeat = repeat;
      return true;
    }

    return false;
  }

  getVolume() {
    return this.volume * 50;
  }

  setVolume(val) {
    this.volume = val / 50;
    if (this.guild.voiceConnection.dispatcher != null)
      this.guild.voiceConnection.dispatcher.setVolume(this.volume);
  }

  join(msg) {
    if (!msg.member.voiceChannel.joinable) {
      //Check if the channel is joinable
      this.current = null;

      MessageManager.create()
        .setTitle(Constants.title.music)
        .setColor(Constants.color.error)
        .setMessage(`Je n'ai pas la permission de vous rejoindre`)
        .send(msg.channel);

      return;
    }

    msg.member.voiceChannel
      .join()
      .then((connection) => {
        this.voiceChannel = msg.member.voiceChannel;
        this.play(msg.channel);
      })
      .catch(console.error);
  }

  leave(channel) {
    this.guild.voiceConnection.disconnect();

    this.voiceChannel = null;
    this.current = null;

    MessageManager.create()
      .setTitle(Constants.title.music)
      .setColor(Constants.color.success)
      .setMessage(
        `Fin de la playlist, utilisez **${Constants.prefix}request** pour ajouter des musiques à la playlist`,
      )
      .send(channel);
  }

  addRequest(channel, request) {
    if (this.current == null) {
      this.current = request;
    } else {
      this.queue.push(request);

      MessageManager.create()
        .setTitle(Constants.title.music)
        .setColor(Constants.color.success)
        .setMessage(
          `Ajout de **[${request.title}](${request.url})** (${Tools.secondsToMinutes(request.length_seconds)}) à la playlist`,
        )
        .send(channel);
    }
  }

  removeRequest(index) {
    if (index < 0 || index >= this.queue.length) return null;
    return this.queue.splice(index, 1)[0];
  }

  shuffle() {
    Tools.shuffle(this.queue);
  }

  play(channel) {
    const streamOptions = { seek: 0, volume: 1 };
    const stream = ytdl(this.current.url, {
      filter: "audioonly",
      quality: "highest",
    });

    this.current.startTime = new Date().getTime();

    this.guild.voiceConnection.playStream(stream, streamOptions);
    this.guild.voiceConnection.dispatcher.setVolume(this.volume);
    this.guild.voiceConnection.dispatcher.on(
      "end",
      function () {
        this.next(channel);
      }.bind(this),
    );

    MessageManager.create()
      .setTitle(Constants.title.music)
      .setColor(Constants.color.success)
      .setMessage(
        `Joue **[${this.current.title}](${this.current.url})** (${Tools.secondsToMinutes(this.current.length_seconds)})`,
      )
      .send(channel);
  }

  skip(channel) {
    if (this.repeat == "SONG") this.current = this.queue.shift();

    if (this.guild.voiceConnection.dispatcher != null)
      this.guild.voiceConnection.dispatcher.end();
    else {
      MessageManager.create()
        .setTitle(Constants.title.music)
        .setColor(Constants.color.info)
        .setMessage(
          `Aucune musique en cours, utilisez **${Constants.prefix}request** pour ajouter des musiques à la playlist`,
        )
        .send(channel);
    }
  }

  next(channel) {
    if (this.repeat == `PLAYLIST`) {
      this.queue.push(this.current);
    }

    if (this.repeat != "SONG") this.current = this.queue.shift();

    if (this.current == null) {
      //Check if queue is empty then leave the channel
      this.leave(channel);
    } else {
      this.play(channel);
    }
  }

  stop(channel) {
    while (this.queue.length > 0) this.queue.pop();
    this.skip(channel);
  }

  pause() {
    if (this.guild.voiceConnection.dispatcher.paused) {
      this.current.startTime += new Date().getTime() - this.current.pauseTime;
      this.pauseTime = null;
      this.guild.voiceConnection.dispatcher.resume();
      return false;
    }

    this.current.pauseTime = new Date().getTime();
    this.guild.voiceConnection.dispatcher.pause();
    return true;
  }
};
