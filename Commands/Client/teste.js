/* const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("teste")
    .setDescription("Apenas um comando de teste"),
  async execute(interaction, client) {
    interaction.reply({ content: "Testado!", ephemeral: true });
  },
};
 */

const Orders = require("../../Models/Orders");

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("teste")
    .setDescription("Apenas um comando de teste"),
  async execute(interaction, client) {
    try {
      // Encontra todos os Orders com status true
      const ordersToDelete = await Orders.find({ status: true });
      if (ordersToDelete.length === 0) {
        return interaction.reply({
          content: "Não há encomendas com status true para deletar.",
          ephemeral: true,
        });
      }

      // Deleta todos os Orders encontrados
      await Orders.deleteMany({ status: true });

      interaction.reply({
        content: `Deletadas ${ordersToDelete.length} encomendas com status true.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Erro ao deletar encomendas:", error);
      interaction.reply({
        content: "Ocorreu um erro ao tentar deletar as encomendas.",
        ephemeral: true,
      });
    }
  },
};