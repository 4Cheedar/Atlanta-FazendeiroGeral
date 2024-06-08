const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const dotenv = require("dotenv");
dotenv.config();

const Farms = require("../../Models/Farms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("valor-plantacao")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription(
      "Utilize esse Comando para atualizar o valor pago nas plantações"
    )
    .addNumberOption((option) =>
      option
        .setMinValue(0.3)
        .setMaxValue(0.41)
        .setName("valor_sementes")
        .setDescription(
          "Digite o valor que você paga por semente plantada! (Fruto/Unidade)"
        )
        .setRequired(true)
    ),
  async execute(interaction, client) {
    let guildID = interaction.guild.id;
    let hasFarm = await Farms.findOne({ GuildID: guildID });

    if (hasFarm) {
      let commandChannel = hasFarm.CommandsChannelID;
      if (interaction.channel.id !== commandChannel)
        return interaction.reply({
          content: `> Não é possivel utilizar esse comando no chat atual! \n> Utilize o comando no chat: <#${commandChannel}>`,
        });

      let seedPrice = interaction.options.getNumber("valor_sementes");

      let actualSeedPrice = hasFarm.SeedPrice;

      if (seedPrice == actualSeedPrice) {
        return interaction.reply({
          content: "> O Valor pago nas plantações atualmente já é este!",
          ephemeral: true,
        });
      }

      hasFarm.SeedPrice = seedPrice;
      await hasFarm.save();

      let plantationEmbed = new EmbedBuilder()
        .setTitle("🌱 Valor Atualizado!")
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `> O **Valor das sementes** foi atualizado para: **$${seedPrice}** (Fruto/Unidade)`
        );

      return interaction.reply({ embeds: [plantationEmbed], ephemeral: true });
    }
  },
};
