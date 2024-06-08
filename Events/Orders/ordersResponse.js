const { EmbedBuilder } = require("discord.js");
const Orders = require("../../Models/Orders");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    try {
      if (!interaction.isModalSubmit()) return;

      const { customId } = interaction;

      if (!["addproduto", "removeproduto"].includes(customId)) return;

      // Defer the reply
      await interaction.deferReply({ ephemeral: true });

      const orderID = interaction.message.content.split(
        "**ID Da Encomenda:** "
      )[1];
      const order = await Orders.findOne({ orderID: orderID });

      if (!order) {
        return interaction.editReply({
          content: "Essa Encomenda não foi encontrada no banco de dados!",
          ephemeral: true,
        });
      }

      switch (customId) {
        case "addproduto":
          let produtoNome =
            interaction.fields.getTextInputValue("produtoNomeInput");

          const addProdutoIndex = order.produtos.findIndex(
            (produto) =>
              produto.split(" - ")[0].toLowerCase() ===
              produtoNome.toLowerCase()
          );

          if (addProdutoIndex !== -1) {
            return interaction.editReply({
              content: "Este produto já foi adicionado.",
              ephemeral: true,
            });
          }

          let produtoQuantidade = interaction.fields.getTextInputValue(
            "produtoQuantidadeInput"
          );
          if (!isNumber(produtoQuantidade)) {
            return interaction.editReply({
              content: "A quantidade deve ser um número.",
              ephemeral: true,
            });
          }

          let produtoValorUnidade = interaction.fields.getTextInputValue(
            "produtoValorUnidadeInput"
          );
          produtoValorUnidade = convertAndCheckNumber(produtoValorUnidade);
          if (produtoValorUnidade === null) {
            return interaction.editReply({
              content: "O valor por unidade deve ser um número.",
              ephemeral: true,
            });
          }

          if (produtoQuantidade < 0) {
            return interaction.editReply({
              content: "Não é possível adicionar uma quantidade negativa!",
              ephemeral: true,
            });
          }

          if (produtoValorUnidade < 0) {
            return interaction.editReply({
              content: "Não é possível adicionar um valor negativo!",
              ephemeral: true,
            });
          }

          let valorTotal = produtoQuantidade * produtoValorUnidade;

          order.produtos.push(
            `${produtoNome.toLowerCase()} - ${produtoQuantidade} - ${produtoValorUnidade} - ${valorTotal.toFixed(
              2
            )}`
          );
          await order.save();

          let valorTotalFinal = 0;

          const embedProduto = new EmbedBuilder()
            .setColor("Orange")
            .setTitle(`${order.orderName}`)
            .setAuthor({
              name: `Encomenda Registrada por: ${interaction.member.displayName}`,
              iconURL: interaction.user.avatarURL(),
            })
            .setDescription(
              `Gerencie a encomenda utilizando os botões!\n> Encomenda feita por: **${order.orderFor} - ${order.pombo}**`
            )
            .setTimestamp()
            .setFooter({
              text: "🤖 | Bot Desenvolvido por: @4cheedar",
              iconURL:
                "https://cdn.discordapp.com/avatars/355122356731248651/a_24205a0a8e169c8da4d8cc2c31a69712?size=1024",
            })
            .setThumbnail(client.user.avatarURL());

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

            nome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();

            embedProduto
              .addFields({
                name: `📦 ${nome} - Quantidade: ${quantidade}`,
                value: `> Valor Total: **$${valorTotal}** ($${valorUnidade}/un.)`,
              })
              .setDescription(
                `Gerencie a encomenda utilizando os botões!\n> Encomenda feita por: **${order.orderFor} - ${order.pombo}**\n\`\`\`Valor Total da Encomenda: ${valorTotalFormatado}\`\`\``
              );
          });

          await interaction.message.edit({
            embeds: [embedProduto],
          });

          return interaction.editReply({
            content: "Produto adicionado com sucesso!",
            ephemeral: true,
          });

        case "removeproduto":
          let removeProdutoNome = interaction.fields.getTextInputValue(
            "removeProdutoNomeInput"
          );

          const produtoLowerCase = removeProdutoNome.toLowerCase();

          const produtoIndex = order.produtos.findIndex((produto) => {
            const [nome] = produto.split(" - ");
            return nome.trim().toLowerCase() === produtoLowerCase;
          });

          if (produtoIndex !== -1) {
            order.produtos.splice(produtoIndex, 1);
            await order.save();

            let valorTotalFinal = 0;

            const embedProduto = new EmbedBuilder()
              .setColor("Orange")
              .setTitle(`${order.orderName}`)
              .setFooter({
                text: "🤖 | Bot Desenvolvido por: @4cheedar",
                iconURL:
                  "https://cdn.discordapp.com/avatars/355122356731248651/a_24205a0a8e169c8da4d8cc2c31a69712?size=1024",
              })
              .setAuthor({
                name: `Encomenda Registrada por: ${interaction.member.displayName}`,
                iconURL: interaction.user.avatarURL(),
              })
              .setDescription(
                `Gerencie a encomenda utilizando os botões!\n> Encomenda feita por: **${order.orderFor} - ${order.pombo}**`
              )
              .setTimestamp()
              .setThumbnail(client.user.avatarURL());

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

              nome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();

              embedProduto
                .addFields({
                  name: `📦 ${nome} - Quantidade: ${quantidade}`,
                  value: `> Valor Total: **$${valorTotal}** ($${valorUnidade}/un.)`,
                })
                .setDescription(
                  `Gerencie a encomenda utilizando os botões!\n> Encomenda feita por: **${order.orderFor} - ${order.pombo}**\n\`\`\`Valor Total da Encomenda: ${valorTotalFormatado}\`\`\``
                );
            });

            await interaction.message.edit({
              embeds: [embedProduto],
            });

            return interaction.editReply({
              content: "Produto removido com sucesso!",
              ephemeral: true,
            });
          } else {
            return interaction.editReply({
              content: `O produto "${removeProdutoNome}" não foi encontrado na lista.`,
              ephemeral: true,
            });
          }

        default:
          return interaction.editReply({
            content: "Tipo de dado não reconhecido!",
            ephemeral: true,
          });
      }
    } catch (error) {
      console.error(
        "Erro inesperado durante o processamento do evento 'interactionCreate':",
        error
      );
      return interaction.editReply({
        content: "Ocorreu um erro ao processar sua solicitação.",
        ephemeral: true,
      });
    }
  },
};

function isNumber(value) {
  return /^-?\d+(\.\d+)?(,\d+)?$/.test(value);
}

function convertAndCheckNumber(value) {
  const sanitizedValue = value.replace(/,/, ".");

  if (!isNumber(sanitizedValue)) {
    return null;
  }

  return sanitizedValue;
}
