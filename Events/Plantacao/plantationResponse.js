const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    try {
      if (!interaction.isButton()) return;

      const { customId } = interaction;

      if (!["pagar_sementes", "remover_sementes"].includes(customId)) return;

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({
          content: "Apenas Administradores podem Utilizar os botões!",
          ephemeral: true
        });
      }

      switch (customId) {
        case "pagar_sementes":
            let sementesPagas = new EmbedBuilder()
            .setTitle(`🌱 | Registro das Plantações`)
            .setDescription(
              `> **Registro feito e plantação paga!** \n > Sementes plantadas por: **${interaction.message.mentions.members.first().displayName}** \n > Confirmação feita por: **${interaction.member.displayName}**`
            )
            .setColor("Green")
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setFooter({
              text: "🤖 | Bot Desenvolvido por: @4cheedar",
              iconURL:
                "https://cdn.discordapp.com/avatars/355122356731248651/a_24205a0a8e169c8da4d8cc2c31a69712?size=1024",
            })
            .setTimestamp();

          await interaction.update({
            embeds: [sementesPagas],
            components: [],
          });

          await interaction.message.react("✅");
          break;

        case "remover_sementes":
            let sementesInvalidas = new EmbedBuilder()
            .setTitle(`🌱 | Registro das Plantações`)
            .setDescription(
              `> Registro da **Plantação Cancelado!** \n > **Plantação Invalida!** \n > ❌ Cancelamento feito por: **${interaction.member.displayName}**`
            )
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor("Red")
            .setFooter({
              text: "🤖 | Bot Desenvolvido por: @4cheedar",
              iconURL:
                "https://cdn.discordapp.com/avatars/355122356731248651/a_24205a0a8e169c8da4d8cc2c31a69712?size=1024",
            })
            .setTimestamp();

          await interaction.update({
            embeds: [sementesInvalidas],
            components: [],
          });

          await interaction.message.react("❌");
          break;

        default:
          return interaction.reply({
            content: "Essa não é uma interação válida!",
            ephemeral: true,
          });
      }
    } catch (error) {
      console.error(
        "Erro inesperado durante o processamento do evento 'interactionCreate': Plantação",
        error
      );
    }
  },
};
