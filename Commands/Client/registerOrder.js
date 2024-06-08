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
const Orders = require("../../Models/Orders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("encomendas")
    .setDescription("Comando utilizado para gerenciar encomendas")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("criar")
        .setDescription("Cria uma Nova Encomenda")
        .addStringOption((options) =>
          options
            .setName("nome-encomenda")
            .setDescription("Escolha um nome para nomear a encomenda")
            .setRequired(true)
        )
        .addStringOption((options) =>
          options
            .setName("quem-encomendou")
            .setDescription("Digite o nome da pessoa que encomendou")
            .setRequired(true)
        )
        .addIntegerOption((options) =>
          options
            .setName("pombo")
            .setDescription("Digite o pombo de quem encomendou")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    let guildID = interaction.guild.id;
    let channelID = interaction.channelID;
    let hasFarm = await Farms.findOne({ GuildID: guildID });

    if (hasFarm) {
      let commandChannel = hasFarm.CommandsChannelID;
      if (interaction.channel.id !== commandChannel)
        return interaction.reply({
          content: `> Não é possivel utilizar esse comando no chat atual! \n> Utilize o comando no chat: <#${commandChannel}>`,
        });

      let commandChoice = interaction.options.getSubcommand();
      let nomeEncomenda = interaction.options.getString("nome-encomenda");

      if (commandChoice == "criar") {
        let quemEncomendou = interaction.options.getString("quem-encomendou");
        let pomboEncomendador = interaction.options.getInteger("pombo");

        const haveOrder = await Orders.findOne({
          orderID: `${guildID}-${channelID}-${nomeEncomenda}`,
        });

        if (haveOrder) {
          return interaction.reply({
            content: `Já existe uma encomenda registrada com esse mesmo nome, escolha outro nome para a encomenda!`,
            ephemeral: true,
          });
        }

        const newOrder = new Orders({
          guildID: guildID,
          channelID: channelID,
          orderID: `${guildID}-${channelID}-${nomeEncomenda}`,
          orderName: nomeEncomenda,
          orderRegister: interaction.user.id,
          orderFor: quemEncomendou,
          pombo: pomboEncomendador,
        });

        await newOrder.save();

        const embedNewOrder = new EmbedBuilder()
          .setTitle(`${nomeEncomenda}`)
          .setAuthor({
            name: `Encomenda Registrada por: ${interaction.member.displayName}`,
            iconURL: interaction.user.avatarURL(),
          })
          .setDescription(
            `Gerencie a encomenda utilizando os botões!\n> Encomenda feita por: **${quemEncomendou} - ${pomboEncomendador}**`
          )
          .setTimestamp()
          .setFooter({
            text: "🤖 | Bot Desenvolvido por: @4cheedar",
            iconURL:
              "https://cdn.discordapp.com/avatars/355122356731248651/a_24205a0a8e169c8da4d8cc2c31a69712?size=1024",
          })
          .setThumbnail(client.user.avatarURL());

        const ordersChannel = client.channels
          .fetch(hasFarm.OrderChannelID)
          .then((channel) => channel);

        const addButton = new ButtonBuilder()
          .setCustomId("adicionar_produto")
          .setLabel("Adicionar Produto")
          .setEmoji("🛒")
          .setStyle(ButtonStyle.Success);

        const removeButton = new ButtonBuilder()
          .setCustomId("remover_produto")
          .setLabel("Remover Produto")
          .setEmoji("🔖")
          .setStyle(ButtonStyle.Secondary);

        const cancelButton = new ButtonBuilder()
          .setCustomId("cancelar_encomenda")
          .setLabel("Cancelar Encomenda")
          .setEmoji("✖️")
          .setStyle(ButtonStyle.Danger);

        const finishButton = new ButtonBuilder()
          .setCustomId("finalizar_encomenda")
          .setLabel("Finalizar Encomenda")
          .setEmoji("✅")
          .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(
          addButton,
          removeButton,
          finishButton,
          cancelButton
        );

        ordersChannel.then((channel) => {
          channel.send({
            embeds: [embedNewOrder],
            components: [row],
            content: `**ID Da Encomenda:** ${guildID}-${channelID}-${nomeEncomenda}`,
          });

          interaction.reply({
            content: `> Nova Encomenda Registrada com sucesso, enviada para o canal: ${channel}`,
            ephemeral: true,
          });
        });
      }
    } else {
      return interaction.reply({
        content:
          "> Não existe uma fazenda registrada nesse servidor! \n> Utilize /adicionar-fazenda e preencha as informações para registrar uma fazenda nesse servidor!",
        ephemeral: true,
      });
    }
  },
};
