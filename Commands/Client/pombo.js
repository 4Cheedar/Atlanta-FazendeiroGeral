const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const dotenv = require("dotenv");
dotenv.config();

const Farms = require("../../Models/Farms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pombo")
    .setDescription("Utilize esse Comando para registrar seu pombo!")
    .addStringOption((options) =>
      options
        .setName("nome")
        .setDescription("Seu Nome dentro do RP!")
        .setRequired(true)
    )
    .addIntegerOption((options) =>
      options
        .setName("pombo")
        .setDescription("Numero do seu Pombo dentro do RP!")
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

      let jogadorNome = interaction.options.getString("nome");
      let jogadorPombo = interaction.options.getInteger("pombo");
      let userName = interaction.user.tag;

      let embedPombo = new EmbedBuilder()
        .setTitle(`🦆 | Registro de Pombos!`)
        .setAuthor({
          name: userName,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          url: "https://www.youtube.com/watch?v=0tOXxuLcaog",
        })
        .setDescription(`${userName} Acaba de Registrar seu Pombo!`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setFooter({
          text: "🤖 | Bot Desenvolvido por: @4cheedar",
          iconURL:
            "https://cdn.discordapp.com/avatars/355122356731248651/a_24205a0a8e169c8da4d8cc2c31a69712?size=1024",
        })
        .addFields([
          {
            name: "Nome Personagem:",
            value: `\`\`\`${jogadorNome}\`\`\``,
            inline: true,
          },
          {
            name: "Numero Pombo:",
            value: `\`\`\`${jogadorPombo}\`\`\``,
            inline: true,
          },
        ])
        .setTimestamp();

      try {
        await interaction.member.edit({
          nick: `${jogadorNome} - ${jogadorPombo}`,
        });
      } catch (error) {
        return interaction.reply({
          content:
            "> Não foi possivel alterar seu nome dentro do servidor, entre em contato com o dono do servidor para fazer essa alteração! \n> **Possivel Motivo:** Cargo do Bot não está acima do seu nas configurações de cargo do servidor!",
          ephemeral: true,
        });
      }

      interaction.reply({
        embeds: [embedPombo],
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
