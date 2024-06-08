const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  name: "interactionCreate",
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return interaction.reply({
        content: "Esse Comando não está funcionando corretamente, acione o suporte!",
        ephemeral: true,
      });

    if(command.developer && interaction.user.id !== process.env.DEV_ID) return interaction.reply({
        content: "Comando Disponivel apenas para Desenvolvedor!",
        ephemeral: true,
    })

    command.execute(interaction, client);
  },
};
