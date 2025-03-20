var Promise = require('promise');

const Command = require('../command.js');

module.exports = class Song extends Command {
  constructor(commandManager) {
    let infos = {
      name: 'song',
      group: Constants.group.music,
      description: `Affiche les détails de la musique en cours de lecture.`,
      example: [''],
      nbArgsMax: 0
    }

    super(commandManager, infos);
  }

  execute(msg, args = []) {
    return new Promise((resolve, reject) => {
      var musicPlayer = this.commandManager.getMusicPlayer(msg);
      if (musicPlayer == null) return;

      var rep = MessageManager.create()
                  .setTitle(Constants.title.music)

      if (!musicPlayer.isPlaying()) {
        rep.setColor(Constants.color.error)
           .setMessage(`Aucune musique en cours, utilisez **${Constants.prefix}request** pour ajouter des musiques à la playlist`);
      } else {
        let current = musicPlayer.getCurrent();
        rep.setColor(Constants.color.success);
        rep.addSongMessage(current);
      }

      rep.send(msg.channel);
      resolve();
    });
  }
}
