const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const dotenv = require("dotenv");
dotenv.config();

const Farms = require("../../Models/Farms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("plantacao")
    .setDescription("Utilize esse Comando para registrar as suas plantações!")
    .addStringOption((options) =>
      options
        .setName("nome-semente")
        .setDescription("Nome da Semente que foi plantada")
        .setRequired(true)
    )
    .addIntegerOption((options) =>
      options
        .setName("quantidade-semente")
        .setDescription("Quantidades de Sementes que foram plantadas")
        .setRequired(true)
        .setMinValue(1)
    )
    .addIntegerOption((options) =>
      options
        .setName("colheita")
        .setDescription("Quantidades de Frutos que foram coletados")
        .setRequired(true)
        .setMinValue(5)
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

      let seedName = interaction.options.getString("nome-semente");
      let seedAmount = interaction.options.getInteger("quantidade-semente");
      let seedHarvest = interaction.options.getInteger("colheita");

      let harvestPrice = hasFarm.SeedPrice;
      let expectedHarvest = seedAmount * 7;

      if (seedHarvest > expectedHarvest) {
        return interaction.reply({
          content: `Quantidade Colhida é maior do que o maximo possivel, Quantidade maxima: ${expectedHarvest}`,
          ephemeral: true,
        });
      }

      let amountToPay = seedHarvest * harvestPrice;
      const totalPay = amountToPay.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let plantationEmbed = new EmbedBuilder()
        .setTitle("🌱 | Registro das Plantações")
        .setDescription(
          `> **Registro das Sementes feito!**\n> Sementes plantadas por: **${interaction.member.displayName}**\n\`\`\`Valor para Receber: ${totalPay}\`\`\``
        )
        .setTimestamp()
        .setFooter({
          text: "🤖 | Bot Desenvolvido por: @4cheedar",
          iconURL:
            "https://cdn.discordapp.com/avatars/355122356731248651/a_24205a0a8e169c8da4d8cc2c31a69712?size=1024",
        })
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .addFields([
          {
            name: `Semente:`,
            value: `\`\`\`${seedName}\`\`\``,
            inline: true,
          },
          {
            name: `Sementes Plantadas:`,
            value: `\`\`\`${seedAmount}\`\`\``,
            inline: true,
          },
          { name: `Frutos Colhidos:`, value: `\`\`\`${seedHarvest}\`\`\`` },
        ]);

      if (expectedHarvest > seedHarvest) {
        plantationEmbed
          .addFields([
            {
              name: "Frutos Esperados:",
              value: `\`\`\`${expectedHarvest}\`\`\``,
              inline: true,
            },
            {
              name: "Quantidade Faltando:",
              value: `\`\`\`${expectedHarvest - seedHarvest}\`\`\``,
              inline: true,
            },
          ])
          .setDescription(
            `> **Registro das Sementes feito!**\n> Sementes plantadas por: **${interaction.member.displayName}**\n> Foram **colhidas menos sementes** do que o esperado!\n\`\`\`Valor para Receber: ${totalPay}\`\`\``
          );
      }

      const plantationChannel = client.channels
        .fetch(hasFarm.SeedChannelID)
        .then((channel) => channel);

      plantationChannel.then((channel) => {
        const payButton = new ButtonBuilder()
          .setCustomId("pagar_sementes")
          .setLabel("Plantação Paga!")
          .setEmoji("✅")
          .setStyle(ButtonStyle.Success);

        const removeButton = new ButtonBuilder()
          .setCustomId("remover_sementes")
          .setLabel("Remover Plantação")
          .setEmoji("❌")
          .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(
          payButton,
          removeButton
        );

        channel.send({
          embeds: [plantationEmbed],
          components: [row],
          content: `<@${interaction.user.id}>`,
        });

        interaction.reply({
          content: `> Plantação Registrada com sucesso, enviada para o canal: ${channel}`,
          ephemeral: true,
        });
      });
    } else {
      return interaction.reply({
        content:
          "> Não existe uma fazenda registrada nesse servidor! \n> Utilize /adicionar-fazenda e preencha as informações para registrar uma fazenda nesse servidor!",
        ephemeral: true,
      });
    }
  },
};
