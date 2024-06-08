const { model, Schema } = require("mongoose");

module.exports = model(
    "Orders",
    new Schema({
        guildID: String,
        channelID: String,
        orderID: String,
        status: {type: Boolean, default: false},
        orderName: { type: String, default: "Nome do Pedido não Informado!"},
        orderRegister: { type: String, default: "ID de quem registrou não informado!"},
        orderFor: { type: String, default: "Nome de quem encomendou não informado!"},
        pombo: { type: Number, default: 0},
        produtos: { type: Array, default: [] },
    })
);