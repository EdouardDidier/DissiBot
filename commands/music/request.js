var Promise = require('promise');

const ytdl = require('ytdl-core');
const search = require('youtube-search');

const Command = require('../command.js');
const SongInfo = require('../../musicplayer/songInfo.js');

const searchOpts = {
  maxResults: 5,
  //key: 'AIzaSyBOWfmXrT8qE3gzBQo62pQwZdVUQbiSpD0'
  key: 'AIzaSyAweN0hql3psf--NT84VcdJ5X971j7sLh8'
};

module.exports = class Request extends Command {
  constructor(commandManager) {
    let infos = {
      name:'request',
      group: Constants.group.music,
      description: `Ajoute une musique à la playlist.`,
      example: ['<URL>', '<Mots Clés>'],
      nbArgsMin: 1
    }

    super(commandManager, infos);
  }

  execute(msg, args = []) {
    return new Promise((resolve, reject) => {
      var musicPlayer = this.commandManager.getMusicPlayer(msg);
      if (musicPlayer == null) return;

      if (args[0].startsWith("http") && args.length == 1) {
        this.makeRequest(msg, musicPlayer, args[0]);
      }
      else if ((args[0].startsWith("http") && args.length != 1) || args.length < 1) {
        MessageManager.create()
          .setColor(Constants.color.error)
          .setTitle(Constants.title.music)
          .setMessage(`Saisie incorrecte, essayez **${Constants.prefix}help request** pour plus d'informations`)
          .send(msg.channel);

        return;
      } else {
        var str = '';
        args.forEach(a => {str += a + ' '});

        search(str, searchOpts, function(err, results) {
          if(err) return console.log(err);

          var url = '';
          let i = -1;
          do {
            i++;
            url = results[i].link;
          } while (i < results.length && results[i].kind != 'youtube#video');

          this.makeRequest(msg, musicPlayer, url);
        }.bind(this));
      }
      resolve();
    });
  }

  makeRequest(msg, musicPlayer, url) {
    ytdl.getInfo(url, (err, info) => {
      if (err) {
        MessageManager.create()
          .setColor(Constants.color.error)
          .setTitle(Constants.title.music)
          .setMessage(`Impossible de trouver une musique correspondant à votre requête`)
          .send(msg.channel);

        console.log(err);

        return;
      }

      var request = new SongInfo(url, info, msg.author);

      //TODO: Check url / research is valid

      musicPlayer.addRequest(msg.channel, request);
      if (!musicPlayer.isConnected()) { //Check if the bot is not connected to a voiceChannel
        musicPlayer.join(msg);
      }
    });
  }
}
