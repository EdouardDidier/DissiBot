module.exports = class {
  constructor(ownerId, intro, data, func) {
    this.data = [];
    data.forEach((val) => {
      this.data.push(func(val));
    });

    this.intro = intro;

    this.page = 1;
    // Defining the number of page of the message
    this.pageMax = Math.ceil(
      this.data.length / Constants.paginator.elemPerPage,
    );
    this.owner = ownerId;
    this.msg = null;

    // Defining the experiration of the message traking
    this.expiration =
      new Date().getTime() + 1000 * Constants.paginator.expiration;
    this.oldVote = {
      "◀": false,
      "⏹": false,
      "▶": false,
    };

    this.message = MessageManager.create();
    this.buildPage();
  }

  setTitle(title) {
    this.message.setTitle(title);
    return this;
  }

  setColor(color) {
    this.message.setColor(color);
    return this;
  }

  addSongMessage(current) {
    this.message.addSongMessage(current);
    return this;
  }

  buildPage() {
    // Adding all elements to the current page
    var str = this.intro + "\n";
    for (
      var i = 0;
      i < Constants.paginator.elemPerPage &&
      i + (this.page - 1) * Constants.paginator.elemPerPage < this.data.length;
      i++
    ) {
      str += `\`${(this.page - 1) * Constants.paginator.elemPerPage + i + 1}\` ${this.data[i + (this.page - 1) * Constants.paginator.elemPerPage]}\n`;
    }

    this.message.setMessage(str);

    // Informing the user that the message has expiration date
    if (this.pageMax > 1)
      this.message.setFooter(
        `Page: ${this.page} / ${this.pageMax} - Ce message expirera 20 secondes après la dernière action.`,
      );
    else this.message.setFooter(`Page: ${this.page} / ${this.pageMax}`);

    return this;
  }

  // Send the message and add the icon to move between pages
  send(channel) {
    if (this.pageMax > 1) {
      return this.message.send(channel).then((msg) => {
        this.msg = msg;
        msg
          .react("◀")
          .then((msgReact) => {
            msgReact.message
              .react("⏹")
              .then((msgReact) => {
                msgReact.message
                  .react("▶")
                  .then((msgReact) => {
                    this.updater();
                  })
                  .catch(console.error);
              })
              .catch(console.error);
          })
          .catch(console.error);
      });
    } else {
      return this.message.send(channel);
    }
  }

  edit(msg) {
    return this.message.edit(msg);
  }

  // Check if a user intereacted with the icons and update the message acordingly
  updater() {
    var tmp = this;

    setTimeout(function () {
      if (tmp.msg != null) {
        tmp.msg.channel
          .fetchMessage(tmp.msg.id)
          .then((msg) => {
            var emoji = {
              "◀": false,
              "⏹": false,
              "▶": false,
            };
            var hasChanged = {};

            msg.reactions.forEach((react) => {
              react.users.forEach((user) => {
                if (tmp.owner == user.id) emoji[react.emoji] = true;
              });
              hasChanged[react.emoji] =
                tmp.oldVote[react.emoji] != emoji[react.emoji] ? true : false;
            });

            tmp.oldVote = emoji;

            if (hasChanged["◀"] == true && tmp.page > 1) {
              tmp.page--;
              tmp.expiration =
                new Date().getTime() + 1000 * Constants.paginator.expiration;
              tmp
                .buildPage()
                .edit(msg)
                .then((msg) => {
                  tmp.updater();
                });
            } else if (hasChanged["▶"] == true && tmp.page < tmp.pageMax) {
              tmp.page++;
              tmp.expiration =
                new Date().getTime() + 1000 * Constants.paginator.expiration;
              tmp
                .buildPage()
                .edit(msg)
                .then((msg) => {
                  tmp.updater();
                });
            } else if (
              hasChanged["⏹"] == true ||
              new Date().getTime() > tmp.expiration
            ) {
              tmp.msg.delete(); //TODO: edit message with 'Le message a expiré !cmd pour raficher la playlist...'
            } else {
              tmp.updater();
            }
          })
          .catch(console.error);
      }
    }, 200);
  }
};
