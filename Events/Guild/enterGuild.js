const console = require("console-emoji-log");
module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    console.info(`Bot Adicionado com Sucesso no servidor: ${guild.name} - ${guild.id}`);
  },
};
