const fs = require("fs");
const path = require("path");

var obj = {
  secondsToMinutes: function (sec) {
    let min = 0;
    while (sec >= 60) {
      min++;
      sec -= 60;
    }

    return min + ":" + (sec < 10 ? "0" + sec : sec);
  },
  getPermissionLevel: function (user) {
    if (user.id == user.guild.ownerID) return 3;

    var level = 0;
    var banLevel = false;
    user.roles.array().forEach((role) => {
      let tmp = Constants.permission[role.name];

      if (tmp != undefined) {
        if (tmp > level) level = tmp;
        if (tmp == -1) banLevel = true;
      }
    });

    if (banLevel && level < 2) return -1;

    return level;
  },
  hasPermission: function (levelRequired, user) {
    return levelRequired <= obj.getPermissionLevel(user);
  },
  // Build a str representing the volume level to display in a message
  buildVolumeStr: function (val, s = 20) {
    let str = "Volume [**";
    for (var i = 0; i < s; i++) {
      if (i < (val * s) / 100) str += "▓";
      else str += "░";
    }

    str += "**] **" + val + "%**";

    return str;
  },
  // Build a str representing the progress in a song to display in a message
  buildProgressBarStr: function (
    startTime,
    currentTime,
    length,
    id = "",
    s = 20,
  ) {
    let val = Math.round((currentTime - startTime) / 1000);
    id = `${Constants.link.youtube}${id}?t=${obj.secondsToMinutes(val).replace(":", "m")}s`;

    let isBPPassed = false;
    let str = "[";
    for (var i = 0; i < s; i++) {
      if (!isBPPassed) {
        if (i > val / (length / s)) {
          isBPPassed = true;
          str += `](${id})`;
        }
      }

      str += "▬";
    }

    if (!isBPPassed) str += `](${id})`;

    str += ` **${obj.secondsToMinutes(val)} / ${obj.secondsToMinutes(length)}**`;

    return str;
  },
  getFilePath: function (dir, excluded = [], filelist = []) {
    fs.readdirSync(dir).forEach((file) => {
      let isExcluded = false;
      excluded.forEach((e) => {
        if (file === e) isExcluded = true;
      });

      if (isExcluded == true) return;

      filelist = fs.statSync(path.join(dir, file)).isDirectory()
        ? obj.getFilePath(path.join(dir, file), excluded, filelist)
        : filelist.concat(path.join(dir, file));
    });

    return filelist;
  },
  shuffle: function (obj) {
    for (let i = obj.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [obj[i - 1], obj[j]] = [obj[j], obj[i - 1]];
    }
  },
};

module.exports = obj;
