# 🐓 FazendeiroGeral Bot

## Descrição
O FazendeiroGeral Bot foi criado para facilitar o gerenciamento das fazendas no condado. Com este bot, fazendeiros podem registrar suas fazendas, gerenciar plantações, rebanhos, e encomendas diretamente no Discord. Totalmente público, qualquer servidor pode adicionar e começar a utilizar suas funcionalidades.

## 🚀 Como Adicionar o Bot

1. Acesse a barra lateral direita do Discord.
2. Encontre o @FazendeiroGeral.
3. Visualize o perfil dele e clique no botão "Adicionar App".
4. Selecione o servidor onde deseja adicionar o bot.

Para qualquer dúvida sobre o convite do bot, funcionamento dos comandos ou outras questões, sinta-se à vontade para enviar uma mensagem na minha DM!

---

## 🛠️ Principais Funcionalidades do Bot

### 🌾 Registro da Fazenda

Esse é o comando inicial e mais essencial do bot. Ele cria um registro da sua fazenda, permitindo a utilização dos outros comandos.

**Comando:**
/adicionar-fazenda [nome_fazenda] [dono_fazenda] [canal_comandos] [canal_encomendas] [canal_rebanho] [canal_plantacao] [valor_sementes]

**Explicação Detalhada:**
- `[nome_fazenda]`: Nome da sua fazenda dentro do RP.
- `[dono_fazenda]`: Nome do dono da fazenda ou donos.
- `[canal_comandos]`: Canal onde os outros comandos do bot serão permitidos.
- `[canal_encomendas]`: Canal onde serão salvas todas as encomendas criadas pelo bot.
- `[canal_rebanho]`: Canal onde serão enviados os comprovantes de venda do gado.
- `[canal_plantacao]`: Canal onde serão salvas todas as plantações feitas.
- `[valor_sementes]`: Valor pago por cada fruto na soma das plantações (ex.: '0,30').

**Observação:** Caso crie o registro de uma fazenda errada, é possível utilizar:
/remover-fazenda
para apagar esse registro!

### 🌱 Gerenciamento das Plantações

Após registrar a fazenda, use o comando `/plantacao` para registrar as plantações.

**Comando:**
/plantacao [nome-semente] [quantidade-semente] [colheita]

**Explicação Detalhada:**
- `[nome-semente]`: Nome da semente plantada.
- `[quantidade-semente]`: Quantidade de sementes plantadas.
- `[colheita]`: Quantidade de frutos colhidos.

**Observação:** Caso deseje alterar o valor pago por sementes, utilize o comando:
/valor-plantacao
e passe o novo valor da plantação!

### 🐄 Gerenciamento dos Rebanhos

Envie uma imagem no canal de rebanho especificado e o bot criará um embed com a venda do gado.

**Funções dos botões:**
- **Rebanho Pago:** Marca a venda como paga.
- **Remover Rebanho:** Cancela a venda.

### 📦 Criação e Gerenciamento de Encomendas

Crie e gerencie encomendas no seu Discord usando `/encomendas criar`.

**Comando:**
/encomendas criar [nome-encomenda] [quem-encomendou] [pombo]

**Explicação Detalhada:**
- `[nome-encomenda]`: Nome da encomenda (deve ser único).
- `[quem-encomendou]`: Nome do RP da pessoa que fez a encomenda.
- `[pombo]`: Número do pombo da pessoa.

**Botões de Encomenda:**
- **Adicionar Produtos:** Adiciona produtos à encomenda.
- **Remover Produtos:** Remove produtos da encomenda.
- **Cancelar Encomenda:** Cancela a encomenda.
- **Finalizar Encomenda:** Finaliza a encomenda.

### 🔄 Alteração de Nomes no Discord

Altere o nome dos jogadores no Discord da sua fazenda com `/pombo`.

**Comando:**
/pombo [nome] [pombo]

**Explicação Detalhada:**
- `[nome]`: Nome do jogador dentro do RP.
- `[pombo]`: Número do pombo do jogador.

**Observação:** Para que a alteração de nomes funcione, o cargo do bot deve ser superior ao dos usuários que utilizarão o comando.

---

Para mais detalhes, imagens de uso ou outras questões, sinta-se à vontade para entrar em contato!

