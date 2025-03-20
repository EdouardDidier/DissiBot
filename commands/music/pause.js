var Promise = require('promise');

const Command = require('../command.js');

module.exports = class Pause extends Command {
  constructor(commandManager) {
    let infos = {
      name: 'pause',
      group: Constants.group.music,
      description: `(Instable) Permet de mettre en pause / reprendre la lecture de la musique en cours.`,
      example: [''],
      nbArgsMax: 0
    }

    super(commandManager, infos);
  }

  execute(msg, args = []) {
    return new Promise((resolve, reject) => {
      var musicPlayer = this.commandManager.getMusicPlayer(msg);
      if (musicPlayer == null) return;

      let rep = MessageManager.create()
                  .setTitle(Constants.title.music);

      if(!musicPlayer.isPlaying()) {
        rep.setColor(Constants.color.error)
           .setMessage(`Aucune musique en cours, utilisez **${Constants.prefix}request** pour ajouter des musiques à la playlist`);
      } else {
        rep.setColor(Constants.color.success)
           .setMessage(musicPlayer.pause() ? 'Mise en pause de la lecture' : 'Reprise de la lecture')
           .addSongMessage(musicPlayer.getCurrent());
      }

      rep.send(msg.channel);

      resolve();
    });
  }
}
