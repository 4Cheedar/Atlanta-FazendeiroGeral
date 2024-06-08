const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
  } = require("discord.js");
  const {
    Guilds,
    GuildMembers,
    GuildMessages,
    GuildVoiceStates,
    GuildMessageReactions,
    MessageContent
  } = GatewayIntentBits;
  
  const { User, Message, GuildMember, ThreadMember } = Partials;
  
  const dotenv = require("dotenv");
  dotenv.config();
  
  const console = require("console-emoji-log");
  
  const client = new Client({
    intents: [
      Guilds,
      GuildMembers,
      GuildMessages,
      GuildVoiceStates,
      GuildMessageReactions,
      MessageContent
    ],
    partials: [User, Message, GuildMember, ThreadMember],
  });
  
  const { loadEvents } = require("./Handlers/eventHandler");
  
  client.events = new Collection();
  client.commands = new Collection();
  
  loadEvents(client);
  
  client.login(process.env.BOT_TOKEN);
  
  // mongoose
  const mongoose = require("mongoose");
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Tempo limite para seleção de servidor em milissegundos
    connectTimeoutMS: 10000,         // Tempo limite de conexão em milissegundos
    socketTimeoutMS: 45000,          // Tempo limite do socket em milissegundos
    maxPoolSize: 5,                  // Tamanho do pool de conexões
    wtimeoutMS: 2500,                // Tempo limite de gravação em milissegundos
    retryWrites: true                // Habilita tentativas de gravação
  };
  
  mongoose.connect(process.env.MONGODB_CONNECT_DEV, options)
    .then(() => {
      console.log("Conexão com o Banco de Dados feita com Sucesso!");
    })
    .catch(err => {
      console.error("Erro na conexão com o Banco de Dados:", err);
    });
  