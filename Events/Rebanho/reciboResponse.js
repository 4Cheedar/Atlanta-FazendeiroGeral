const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    try {
      if (!interaction.isButton()) return;

      const { customId } = interaction;

      if (!["pagar_rebanho", "remover_rebanho"].includes(customId)) return;

      if (!interaction.member.permissions.has("ADMINISTRATOR")) {
        return interaction.reply({
          content: "Apenas Administradores podem Utilizar os botões!",
        });
      }

      switch (customId) {
        case "pagar_rebanho":
          let rebanhoPago = new EmbedBuilder()
            .setTitle(`🐮 | Recibo do Rebanho!`)
            .setDescription(
              `💸 | Esse Rebanho foi Aprovado! \n > **Rebanho confirmado e pago!**`
            )
            .setColor("Green")
            .addFields([
              {
                name: "Vendedor:",
                value: `\`\`\`${
                  interaction.message.mentions.members.first().displayName
                }\`\`\``,
                inline: true,
              },
            ])
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setFooter({
              text: "🤖 | Bot Desenvolvido por: @4cheedar",
              iconURL:
                "https://cdn.discordapp.com/avatars/355122356731248651/a_24205a0a8e169c8da4d8cc2c31a69712?size=1024",
            })
            .setTimestamp();

          await interaction.update({
            embeds: [rebanhoPago],
            components: [],
          });

          await interaction.message.react("✅");
          break;

        case "remover_rebanho":
          let rebanhoInvalido = new EmbedBuilder()
            .setTitle(`🐮 | Gado Cancelado!`)
            .setDescription(
              `❌ | Esse Rebanho foi cancelado! \n > **Rebanho Invalido!**`
            )
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .addFields([
              {
                name: "Vendedor:",
                value: `\`\`\`${
                  interaction.message.mentions.members.first().displayName
                }\`\`\``,
                inline: true,
              },
            ])
            .setColor("Red")
            .setFooter({
              text: "🤖 | Bot Desenvolvido por: @4cheedar",
              iconURL:
                "https://cdn.discordapp.com/avatars/355122356731248651/a_24205a0a8e169c8da4d8cc2c31a69712?size=1024",
            })
            .setTimestamp();

          await interaction.update({
            embeds: [rebanhoInvalido],
            components: [],
          });

          await interaction.message.react("❌");

          break;

        default:
          interaction.reply({
            content: `> ID de interação desconhecido!`,
            ephemeral: true,
          });
          break;
      }
    } catch (error) {
      console.error(
        "Erro inesperado durante o processamento do evento 'interactionCreate': Recibo",
        error
      );
    }
  },
};
