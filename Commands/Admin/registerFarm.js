const dotenv = require("dotenv");
dotenv.config();

const Farms = require("../../Models/Farms");
const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord-api-types/v10");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("adicionar-fazenda")
    .setDescription("Comando Utilizado para adicionar sua fazenda no bot!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("nome_fazenda")
        .setMaxLength(30)
        .setDescription("Digite o nome da sua Fazenda!")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("dono_fazenda")
        .setMaxLength(20)
        .setDescription("Digite o nome do dono da Fazenda!")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("canal_comandos")
        .setDescription(
          "Selecione o canal onde será permitido a utilização dos comandos!"
        )
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("canal_encomendas")
        .setDescription(
          "Selecione o canal onde será enviado as Encomendas para gerenciar!"
        )
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("canal_rebanho")
        .setDescription(
          "Selecione o canal onde será enviado os comprovantes de venda do gado!"
        )
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("canal_plantacao")
        .setDescription(
          "Selecione o canal onde será enviado as informações sobre as plantações!"
        )
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setMinValue(0.3)
        .setMaxValue(0.41)
        .setName("valor_sementes")
        .setDescription("Digite o valor que você paga por semente plantada!")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    let guildID = interaction.guild.id;

    const hasFarm = await Farms.findOne({ GuildID: guildID });

    if (hasFarm) {
      return interaction.reply({
        content:
          "> Você já tem uma fazenda registrada nesse Servidor do Discord, utilize /remover-fazenda para remover a atual e conseguir criar outra!",
        ephemeral: true,
      });
    }

    let farmName = interaction.options.getString("nome_fazenda");
    let farmOwner = interaction.options.getString("dono_fazenda");
    let seedPrice = interaction.options.getNumber("valor_sementes");
    let commandsChannel = interaction.options.getChannel("canal_comandos");
    let orderChannel = interaction.options.getChannel("canal_encomendas");
    let cowChannel = interaction.options.getChannel("canal_rebanho");
    let seedChannel = interaction.options.getChannel("canal_plantacao");

    const newFarm = new Farms({
      GuildID: guildID,
      RanchName: farmName,
      OwnerName: farmOwner,
      SeedPrice: seedPrice,
      CommandsChannelID: commandsChannel.id,
      OrderChannelID: orderChannel.id,
      CowChannelID: cowChannel.id,
      SeedChannelID: seedChannel.id,
    });

    await newFarm.save();

    let newFarmEmbed = new EmbedBuilder()
      .setTitle("🧑‍🌾 | Fazenda Registrada!")
      .setDescription(
        "✅ Sua **Fazenda foi Registrada!** \nAgora é possivel utilizar todos os comandos para gerenciar sua fazenda!"
      )
      .addFields([
        {
          name: "> 📖 Nome da Fazenda:",
          value: `\`\`\`${farmName}\`\`\``,
          inline: true,
        },
        {
          name: "> 🧑‍🌾 Dono da Fazenda:",
          value: `\`\`\`${farmOwner}\`\`\``,
          inline: true,
        },
        {
          name: "> 💸 Valor Pago na Semente:",
          value: `\`\`\`${seedPrice}\`\`\``,
        },
        {
          name: "> 📑 Chat de Comandos:",
          value: `${commandsChannel}`,
          inline: true,
        },
        {
          name: "> 📑 Chat das Encomendas:",
          value: `${orderChannel}`,
          inline: true,
        },
        { name: "> 📑 Chat do Rebanho:", value: `${cowChannel}`, inline: true },
        {
          name: "> 📑 Chat da Plantação:",
          value: `${seedChannel}`,
        },
      ])

      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: "🤖 | Bot Desenvolvido por: @4cheedar",
        iconURL:
          "https://cdn.discordapp.com/avatars/355122356731248651/a_24205a0a8e169c8da4d8cc2c31a69712?size=1024",
      });

    interaction.reply({ embeds: [newFarmEmbed] });
  },
};
