const { loadCommands } = require("../../Handlers/commandHandler");
const { ActivityType } = require("discord.js");

const console = require("console-emoji-log");

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.success(`${client.user.tag} Ligado com Sucesso!`);

    client.user.setPresence({
      activities: [
        { name: `O trabalho de vocês`, type: ActivityType.Watching },
        { name: `Varrendo Valentine`, type: ActivityType.Playing },
        { name: `Cultivando...`, type: ActivityType.Playing },
        { name: `Comprando Sementes em VanHorn`, type: ActivityType.Playing },
        { name: `Caindo na lama de Valentine`, type: ActivityType.Watching },
        { name: `Craftando Itens...`, type: ActivityType.Playing },
        { name: `Sementes na Terra`, type: ActivityType.Playing },
        { name: `Comprando comida no Saloon`, type: ActivityType.Watching },
      ],
      status: "dnd",
    });

    loadCommands(client);
  },
};
