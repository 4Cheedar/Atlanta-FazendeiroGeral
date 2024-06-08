const dotenv = require("dotenv");
dotenv.config();

const Farms = require("../../Models/Farms");
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;

    if (message.attachments.size > 0) {
      let guildID = message.guild.id;
      let hasFarm = await Farms.findOne({ GuildID: guildID });

      if (hasFarm) {
        let rebanhoChannel = hasFarm.CowChannelID;
        if (message.channel.id == rebanhoChannel) {
          const attachmentURL = message.attachments.first().url;

          let userName = message.member.displayName;

          const horaAtual = new Date().toLocaleTimeString("pt-BR", {
            hour12: false,
          });

          let embedRebanhoVendido = new EmbedBuilder()
            .setTitle(`🐮 | Gado Vendido!`)
            .setAuthor({
              name: hasFarm.RanchName,
              iconURL: message.guild.iconURL({ dynamic: true }),
              url: "https://www.youtube.com/watch?v=0tOXxuLcaog",
            })
            .setDescription(
              `✅ | Um Gado **Acabou de Ser Vendido!** \n > **Verifique a Imagem** de Venda!`
            )
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .addFields([
              {
                name: "Vendedor:",
                value: `\`\`\`${userName}\`\`\``,
                inline: true,
              },
              {
                name: "Hora da Venda: ",
                value: `\`\`\`${horaAtual}\`\`\``,
                inline: true,
              },
            ])
            .setImage(attachmentURL)
            .setFooter({
              text: "🤖 | Bot Desenvolvido por: @4cheedar",
              iconURL:
                "https://cdn.discordapp.com/avatars/355122356731248651/a_24205a0a8e169c8da4d8cc2c31a69712?size=1024",
            })
            .setTimestamp();

          const payButton = new ButtonBuilder()
            .setCustomId("pagar_rebanho")
            .setLabel("Rebanho Pago")
            .setEmoji("✅")
            .setStyle(ButtonStyle.Success);

          const removeButton = new ButtonBuilder()
            .setCustomId("remover_rebanho")
            .setLabel("Remover Rebanho")
            .setEmoji("❌")
            .setStyle(ButtonStyle.Secondary);

          const row = new ActionRowBuilder().addComponents(
            payButton,
            removeButton
          );

          message.channel.send({
            content: `${message.author.toString()}`,
            embeds: [embedRebanhoVendido],
            components: [row],
          });
        }
      }
    }
  },
};
