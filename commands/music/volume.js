var Promise = require('promise');

const Command = require('../command.js');

module.exports = class Volume extends Command {
  constructor(commandManager) {
    let infos = {
      name: 'volume',
      group: Constants.group.music,
      description: `Permet d'afficher / modifier le volume du lecteur.`,
      example: ['', '<0-100>'],
      nbArgsMax: 1
    }

    super(commandManager, infos);
  }

  execute(msg, args = []) {
    return new Promise((resolve, reject) => {
      var musicPlayer = this.commandManager.getMusicPlayer(msg);
      if (musicPlayer == null) return;

      let color = Constants.color.success;
      let str = '';

      if (args.length == 0) {
          str = Tools.buildVolumeStr(musicPlayer.getVolume());
      } else {
        let val = args[0];
        if (val < 0 || val > 100 || isNaN(val)) {
          color = Constants.color.error;
          str = `Saisie incorrecte, essayez **${Constants.prefix}volume <0-100>**`;
        } else {
          musicPlayer.setVolume(val);
          str = Tools.buildVolumeStr(val);
        }
      }

      MessageManager.create()
        .setTitle(Constants.title.music)
        .setColor(color)
        .setMessage(str)
        .send(msg.channel);

      resolve();
    });
  }
}
