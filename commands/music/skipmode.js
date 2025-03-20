var Promise = require('promise');

const Command = require('../command.js');

module.exports = class Skipmode extends Command {
  constructor(commandManager) {
    let infos = {
      name: 'skipmode',
      group: Constants.group.music,
      description: `Définie le mode de skip des musiques.`  //TODO: Change to dynamique?
                 + `\n**\`FREE\`**: n'importe qui peut skipper n'importe quelle musique`
                 + `\n**\`VOTE\`**: il est possible de skipper un musique par vote`
                 + `\n**\`NONE\`**: il n'est pas possible de skipper une musique`,
      example: ['<mode>'],
      permissionLevel: 1,
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
           .setMessage(`Le skipmode est actuellement sur **${musicPlayer.getMode()}**`);
      } else {
        args[0] = args[0].toUpperCase();

        if (musicPlayer.setMode(args[0])) {
          rep.setColor(Constants.color.success)
             .setMessage(`Le skipmode est maintenant **${args[0]}**`);
        } else {
          rep.setColor(Constants.color.error)
             .setMessage(`Saisie incorrecte, essayez **${Constants.prefix}help skipmode** pour plus d'informations`);
        }
      }

      rep.send(msg.channel);

      resolve();
    });
  }
}
