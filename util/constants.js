var Constants = {
  prefix: "!",
  // Permission level associated to roles on a specific server
  permission: {
    Dissident: 2,
    Séparatiste: 1,
    DissiBanned: -1,
  },
  paginator: {
    elemPerPage: 10,
    expiration: 20,
  },
  link: {
    youtube: "https://youtu.be/",
  },
  color: {
    success: 0x22e71b,
    error: 0xd8000c,
    warning: 0xfdfb2d,
    info: 0x3de6e3,
  },
  title: {
    info: "Information",
    warn: "Attention",
    error: "Erreur",
    music: "Lecteur",
  },
  group: {
    general: "Générale",
    music: "Musique",
  },
};

module.exports = Constants;
