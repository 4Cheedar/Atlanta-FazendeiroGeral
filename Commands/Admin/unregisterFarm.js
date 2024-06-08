const dotenv = require("dotenv");
dotenv.config();

const Farms = require("../../Models/Farms");
const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remover-fazenda")
    .setDescription("Comando Utilizado para remover sua fazenda no bot!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    let guildID = interaction.guild.id;

    const hasFarm = await Farms.findOneAndDelete({ GuildID: guildID });

    if (!hasFarm) {
      return interaction.reply({
        content:
          "> Você não tem uma fazenda registrada nesse Servidor do Discord, utilize /adicionar-fazenda para registrar sua fazenda!",
        ephemeral: true,
      });
    }

    let unregisterFarm = new EmbedBuilder()
      .setTitle("🧑‍🌾 | Fazenda Deletada!")
      .setDescription(
        "❌ Sua **Fazenda foi removida dos Registros!** \nTodos os Comandos foram desativados!"
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: "🤖 | Bot Desenvolvido por: @4cheedar", iconURL: "https://cdn.discordapp.com/avatars/355122356731248651/a_24205a0a8e169c8da4d8cc2c31a69712?size=1024",
      });

    interaction.reply({ embeds: [unregisterFarm] });
  },
};
