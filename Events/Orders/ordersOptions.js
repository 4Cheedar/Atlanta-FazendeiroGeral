const {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

const Orders = require("../../Models/Orders");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    try {
      if (!interaction.isButton()) return;

      const { customId } = interaction;

      if (
        ![
          "adicionar_produto",
          "remover_produto",
          "cancelar_encomenda",
          "finalizar_encomenda",
        ].includes(customId)
      )
        return;

      const orderID = interaction.message.content.split(
        "**ID Da Encomenda:** "
      )[1];

      const order = await Orders.findOne({ orderID: orderID });

      if (order) {
        switch (customId) {
          case "adicionar_produto":
            const addProdutoModal = new ModalBuilder()
              .setCustomId("addproduto")
              .setTitle("Adicionar Produto");

            const modalNomeProduto = new TextInputBuilder()
              .setCustomId("produtoNomeInput")
              .setLabel("Nome do Produto para Adicionar:")
              .setStyle(TextInputStyle.Paragraph)
              .setMinLength(1)
              .setMaxLength(100)
              .setPlaceholder("Exemplo: Álcool Industrial")
              .setRequired(true);

            const modalQuantidadeProduto = new TextInputBuilder()
              .setCustomId("produtoQuantidadeInput")
              .setLabel("Quantidade do Produto:")
              .setStyle(TextInputStyle.Short)
              .setPlaceholder(`Digite apenas números, Exemplo: "50" `)
              .setMinLength(1)
              .setMaxLength(10)
              .setRequired(true);

            const modalValorUnidadeProduto = new TextInputBuilder()
              .setCustomId("produtoValorUnidadeInput")
              .setLabel("Valor da Unidade:")
              .setStyle(TextInputStyle.Short)
              .setMinLength(1)
              .setMaxLength(10)
              .setPlaceholder(`Digite apenas números, Exemplo: "1.50" `)
              .setRequired(true);

            const mdNomeProduto = new ActionRowBuilder().addComponents(
              modalNomeProduto
            );

            const mdQuantidadeProduto = new ActionRowBuilder().addComponents(
              modalQuantidadeProduto
            );

            const mdValorUnidadeProduto = new ActionRowBuilder().addComponents(
              modalValorUnidadeProduto
            );

            addProdutoModal.addComponents(
              mdNomeProduto,
              mdQuantidadeProduto,
              mdValorUnidadeProduto
            );

            await interaction.showModal(addProdutoModal);

            break;

          case "remover_produto":
            const removeProdutoModal = new ModalBuilder()
              .setCustomId("removeproduto")
              .setTitle("Remover Produto");

            const removeNomeProduto = new TextInputBuilder()
              .setCustomId("removeProdutoNomeInput")
              .setLabel("Nome do Produto para Remover:")
              .setStyle(TextInputStyle.Paragraph)
              .setMinLength(1)
              .setMaxLength(100)
              .setPlaceholder(
                "Digite o nome do produto que será removido da encomenda, exemplo: Álcool Industrial"
              )
              .setRequired(true);

            const mdRemoveProduto = new ActionRowBuilder().addComponents(
              removeNomeProduto
            );

            removeProdutoModal.addComponents(mdRemoveProduto);

            await interaction.showModal(removeProdutoModal);
            break;

          case "cancelar_encomenda":
            if (
              interaction.user.id == order.orderRegister ||
              interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
            ) {
              interaction.update({
                content: " ",
                embeds: [
                  new EmbedBuilder()
                    .setColor("Red")
                    .setTitle(`❌ | Encomenda Cancelada!`)
                    .setThumbnail(interaction.guild.iconURL())
                    .setDescription(
                      `> A Encomenda **${order.orderName}** foi **cancelada** com sucesso!`
                    )
                    .setAuthor({
                      name: `Cancelada por: ${interaction.member.displayName}`,
                      iconURL: interaction.user.avatarURL(),
                    })
                    .setFooter({
                      text: "🤖 | Bot Desenvolvido por: @4cheedar",
                      iconURL:
                        "https://cdn.discordapp.com/avatars/355122356731248651/a_24205a0a8e169c8da4d8cc2c31a69712?size=1024",
                    })
                    .setTimestamp(),
                ],
                components: [],
              });

              await order.deleteOne();
            } else {
              return interaction.reply({
                content: "Você não tem permissão para cancelar uma encomenda!",
              });
            }
            break;

          case "finalizar_encomenda":
            if (
              interaction.user.id == order.orderRegister ||
              interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
            ) {
              if (order.produtos.length === 0) {
                return interaction.reply({
                  content:
                    "Não existe nenhum produto na encomenda, **adicione um produto** ou **cancele a encomenda!**",
                  ephemeral: true,
                });
              }

              let valorTotalFinal = 0;
              const embedFinish = new EmbedBuilder()
                .setColor("Green")
                .setAuthor({
                  name: `Finalizada por: ${interaction.member.displayName}`,
                  iconURL: interaction.user.avatarURL(),
                })
                .setTitle(`✅ ${order.orderName} - Finalizado!`)
                .setDescription(
                  `> Encomenda feita por: **${order.orderFor} - ${order.pombo}**`
                )
                .setTimestamp()
                .setFooter({
                  text: "🤖 | Bot Desenvolvido por: @4cheedar",
                  iconURL:
                    "https://cdn.discordapp.com/avatars/355122356731248651/a_24205a0a8e169c8da4d8cc2c31a69712?size=1024",
                })
                .setThumbnail(client.user.avatarURL());

              await order.deleteOne();

              order.produtos.forEach((produto) => {
                let [nome, quantidade, valorUnidade, valorTotal] =
                  produto.split(" - ");

                valorTotalFinal += parseFloat(valorTotal);

                const valorTotalFormatado = valorTotalFinal.toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD",
                  }
                );

                nome =
                  nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();

                embedFinish
                  .addFields({
                    name: `📦 ${nome} - Quantidade: ${quantidade}`,
                    value: `> Valor Total: **$${valorTotal}** ($${valorUnidade}/un.)`,
                  })
                  .setFooter({
                    text: "🤖 | Bot Desenvolvido por: @4cheedar",
                    iconURL:
                      "https://cdn.discordapp.com/avatars/355122356731248651/a_24205a0a8e169c8da4d8cc2c31a69712?size=1024",
                  })
                  .setDescription(
                    `A Encomenda Foi **Finalizada com sucesso!**\n> Encomenda feita por: **${order.orderFor} - ${order.pombo}**\n\`\`\`Valor Total da Encomenda: ${valorTotalFormatado}\`\`\`\n> **Produtos:**`
                  );
              });

              interaction.update({
                content: " ",
                embeds: [embedFinish],
                components: [],
              });
            } else {
              return interaction.reply({
                content: "Você não tem permissão para cancelar uma encomenda!",
              });
            }
            break;

          default:
            return interaction.reply({
              content: "Essa não é uma interação válida!",
              ephemeral: true,
            });
        }
      } else {
        return interaction.reply({
          content: "Essa Encomenda não foi encontrada no banco de dados!",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(
        "Erro inesperado durante o processamento do evento 'interactionCreate':",
        error
      );
    }
  },
};
