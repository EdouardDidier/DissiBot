var Promise = require('promise');

const Command = require('../command.js');

module.exports = class Repeat extends Command {
  constructor(commandManager) {
    let infos = {
      name: 'repeat',
      group: Constants.group.music,
      description: `Définie le mode de répétition des musiques`
                 + `\n**\`SONG\`**: la musique en cours va boucler`
                 + `\n**\`PLAYLIST\`**: l'ensmble de la playlist va boucler`
                 + `\n**\`NONE\`**: pas de répétition`,
      example: ['<mode>'],
      nbArgsMin: 0,
      nbArgsMax: 1
    }

    super(commandManager, infos);
  }

  execute(msg, args = []) {
    return new Promise((resolve, reject) => {
      var musicPlayer = this.commandManager.getMusicPlayer(msg);
      if (musicPlayer == null) return;

      var rep = MessageManager.create()
                  .setTitle(Constants.title.music);

      if (args.length == 0) {
        rep.setColor(Constants.color.success)
           .setMessage(`Le repeat est actuellement sur **${musicPlayer.getRepeat()}**`);
      } else {
        args[0] = args[0].toUpperCase();

        if (musicPlayer.setRepeat(args[0])) {
          rep.setColor(Constants.color.success)
             .setMessage(`Le repeat est maintenant **${args[0]}**`);
        } else {
          rep.setColor(Constants.color.error)
             .setMessage(`Saisie incorrecte, essayez **${Constants.prefix}help repeat** pour plus d'informations`);
        }
      }

      rep.send(msg.channel);

      resolve();
    });
  }
}
