const MessageBuilder = require('./messageBuilder.js');

module.exports = class VoteBuilder extends MessageBuilder {
  constructor(func, args) {
    super();

    this.func = func;
    this.args = args;
  }

  checkVote(msg) {
    var tmp = this;
    var total = [];

    setTimeout(function() {
      msg.channel.fetchMessage(msg.id)
        .then(msg => {
          msg.reactions.forEach(react => {
            total[react.emoji] = react.count;
          });

          console.log(total);
          if (total['👍'] > total['👎']) {  //TODO: Edit Message
            tmp.func(tmp.args);
          } else {

          }
        }).catch(console.error);
    }, 15000);
  }

  send(channel) {
    var tmp = this;
    var promise = channel.send(this.build())
                    .then(msg => {
                      tmp.checkVote(msg);

                      msg.react('👍')
                        .then(msgReact => {
                          msgReact.message.react('👎').catch(console.error);
                        }).catch(console.error);
                    }).catch(console.error);


    return promise;
  }
}
