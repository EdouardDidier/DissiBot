const Discord = require("discord.js");

module.exports = class MessageBuilder {
  constructor() {
    this.embed = new Discord.RichEmbed();
  }

  setChannel(channel) {
    this.channel = channel;
    return this;
  }

  setTitle(title) {
    this.embed.setTitle(title);
    return this;
  }

  setMessage(message) {
    this.embed.setDescription(message);
    return this;
  }

  setColor(color) {
    this.embed.setColor(color);
    return this;
  }

  addField(title, message, inline = false) {
    this.embed.addField(title, message, inline);
    return this;
  }

  setFooter(message) {
    this.embed.setFooter(message);
    return this;
  }

  build() {
    let embed = this.embed;
    return { embed };
  }

  send(channel) {
    return channel.send(this.build()).catch(console.error);
  }

  edit(msg) {
    return msg.edit(this.build()).catch(console.error);
  }

  // Add specific format to the message to display informations about musics
  addSongMessage(current) {
    this.embed
      .addField(
        `Musique en cours`,
        `**[${current.title}](${current.url})**, ajouté par <@${current.author.id}>`,
      )
      .addField(
        "Progression",
        Tools.buildProgressBarStr(
          current.startTime,
          new Date().getTime(),
          current.length_seconds,
          current.id,
        ),
      );
    return this;
  }
};
