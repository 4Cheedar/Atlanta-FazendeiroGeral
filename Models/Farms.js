const { model, Schema } = require("mongoose");

module.exports = model(
    "Farms",
    new Schema({
        GuildID: String, 
        RanchName: { type: String, default: "Fazenda"},
        OwnerName: { type: String, default: "Sem Dono"},
        CommandsChannelID: { type: String, default: "Sem Canal"},
        SeedChannelID: { type: String, default: "Sem Canal"},
        OrderChannelID: { type: String, default: "Sem Canal"},
        CowChannelID: { type: String, default: "Sem Canal"},
        SeedPrice: { type: Number, default: 0.30}
    })
)