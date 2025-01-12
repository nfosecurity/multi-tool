const Discord = require('discord.js-selfbot-v13');
const chalk = require('chalk');
const readline = require('readline');
const axios = require('axios');
const { setCmdTitle } = require('arcus-cmd-utils'); 

setCmdTitle('Xena Multi Tools - Version ; 1.0');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function clearScreen() {
  console.clear();
  showTitle();
}

function showTitle() {
  console.log(chalk.blue(`

    ██╗  ██╗███████╗███╗   ██╗ █████╗ 
    ╚██╗██╔╝██╔════╝████╗  ██║██╔══██╗
     ╚███╔╝ █████╗  ██╔██╗ ██║███████║
     ██╔██╗ ██╔══╝  ██║╚██╗██║██╔══██║
    ██╔╝ ██╗███████╗██║ ╚████║██║  ██║
    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝
                                          
`));
}
clearScreen();
rl.question('Please enter your Discord token: ', (token) => {
  clearScreen();
  const client = new Discord.Client();

  let whitelist = [];

  client.on('ready', () => {
    clearScreen();
    console.log(chalk.blue('Logged in as ' + client.user.tag));

    function showMenu() {
      clearScreen();
      console.log(chalk.blue(`
        [1] Clear
        [2] Limpar todas mensagens de DM's abertas
        [3] Obter todas as amizades
        [4] Obter informações do token
        [5] Spam servidores
        [6] Bloquear todos amigos
        [7] Spam configurações
        [8] Sair de todos os servidores
        [9] Fechar todas as DMs
        [10] Ciclar status do token
        [11] Enviar DM em massa
        [12] Marcar servidores como lidos
        [13] Deletar webhooks do Discord
        [14] Add User Whitelist
        [15] Remove User Whitelist
      `));

      rl.question(chalk.white('Escolha uma opção: '), async (option) => {
        clearScreen();
        switch (option) {
          case '1':
            rl.question(chalk.white('Digite o ID do canal: '), async (channelId) => {
              const channel = await client.channels.fetch(channelId);
              if (channel) {
                const messages = await channel.messages.fetch({ limit: 100 });
                let count = 0;
                for (const message of messages.values()) {
                  if (message.author.id === client.user.id) {
                    try {
                      await message.delete();
                      count++;
                      console.log(chalk.blue(`${count} mensagem excluida`));
                    } catch (error) {
                      console.error(chalk.red(`Erro ao excluir mensagem: ${error.message}`));
                    }
                  }
                }
              }
              showMenu();
            });
            break;
          case '2':
            for (const [id, dm] of client.channels.cache.filter(c => c.type === 'DM')) {
              if (whitelist.includes(dm.recipient.id)) {
                console.log(chalk.blue(`Skipping DM with ${dm.recipient.username} (whitelisted)`));
                continue;
              }
              const messages = await dm.messages.fetch({ limit: 100 });
              let count = 0;
              for (const message of messages.values()) {
                if (message.author.id === client.user.id) {
                  try {
                    await message.delete();
                    count++;
                    console.log(chalk.blue(`DM ${dm.recipient.username}: ${count} mensagem excluida`));
                  } catch (error) {
                    console.error(chalk.red(`Erro ao excluir mensagem: ${error.message}`));
                  }
                }
              }
            }
            console.log(chalk.blue('Todas as mensagens de DM\'s abertas foram excluídas.'));
            showMenu();
            break;
          case '3':
            const friends = await axios.get('https://canary.discord.com/api/v8/users/@me/relationships', {
              headers: { authorization: token }
            });
            friends.data.forEach(friend => {
              console.log(chalk.blue(`${friend.user.username}#${friend.user.discriminator}`));
              console.log(chalk.white('----------'));
            });
            showMenu();
            break;
          case '4':
            const tokenInfo = await axios.get('https://canary.discord.com/api/v9/users/@me', {
              headers: { authorization: token }
            });
            Object.keys(tokenInfo.data).forEach(key => {
              console.log(`${chalk.white(key)}: ${chalk.blue(tokenInfo.data[key])}`);
            });
            showMenu();
            break;
          case '5':
            for (let i = 0; i < 25; i++) {
              const payload = { name: generateRandomString(15) };
              await axios.post('https://canary.discord.com/api/v8/guilds', payload, {
                headers: { authorization: token }
              });
            }
            showMenu();
            break;
          case '6':
            const blockFriends = await axios.get('https://canary.discord.com/api/v8/users/@me/relationships', {
              headers: { authorization: token }
            });
            for (const friend of blockFriends.data) {
              await axios.put(`https://canary.discord.com/api/v8/users/@me/relationships/${friend.id}`, { type: 2 }, {
                headers: { authorization: token }
              });
              console.log(chalk.blue(`Blocked Friend ${friend.id}`));
            }
            showMenu();
            break;
          case '7':
            for (let i = 0; i < 100; i++) {
              const headers = { authorization: token, 'user-agent': 'Samsung Fridge/6.9' };
              let conditionStatus = true;
              let payload = {
                theme: 'light', developer_mode: conditionStatus, afk_timeout: 60, locale: 'ko',
                message_display_compact: conditionStatus, explicit_content_filter: 2, default_guilds_restricted: conditionStatus,
                friend_source_flags: { all: conditionStatus, mutual_friends: conditionStatus, mutual_guilds: conditionStatus },
                inline_embed_media: conditionStatus, inline_attachment_media: conditionStatus, gif_auto_play: conditionStatus,
                render_embeds: conditionStatus, render_reactions: conditionStatus, animate_emoji: conditionStatus,
                convert_emoticons: conditionStatus, animate_stickers: 1, enable_tts_command: conditionStatus,
                native_phone_integration_enabled: conditionStatus, contact_sync_enabled: conditionStatus,
                allow_accessibility_detection: conditionStatus, stream_notifications_enabled: conditionStatus,
                status: 'idle', detect_platform_accounts: conditionStatus, disable_games_tab: conditionStatus
              };
              await axios.patch('https://canary.discord.com/api/v8/users/@me/settings', payload, { headers });
              conditionStatus = false;
              payload = {
                theme: 'dark', developer_mode: conditionStatus, afk_timeout: 120, locale: 'bg',
                message_display_compact: conditionStatus, explicit_content_filter: 0, default_guilds_restricted: conditionStatus,
                friend_source_flags: { all: conditionStatus, mutual_friends: conditionStatus, mutual_guilds: conditionStatus },
                inline_embed_media: conditionStatus, inline_attachment_media: conditionStatus, gif_auto_play: conditionStatus,
                render_embeds: conditionStatus, render_reactions: conditionStatus, animate_emoji: conditionStatus,
                convert_emoticons: conditionStatus, animate_stickers: 2, enable_tts_command: conditionStatus,
                native_phone_integration_enabled: conditionStatus, contact_sync_enabled: conditionStatus,
                allow_accessibility_detection: conditionStatus, stream_notifications_enabled: conditionStatus,
                status: 'dnd', detect_platform_accounts: conditionStatus, disable_games_tab: conditionStatus
              };
              await axios.patch('https://canary.discord.com/api/v8/users/@me/settings', payload, { headers });
            }
            showMenu();
            break;
          case '8':
            const servers = await axios.get('https://canary.discord.com/api/v8/users/@me/guilds', {
              headers: { authorization: token }
            });
            for (const guild of servers.data) {
              await axios.delete(`https://canary.discord.com/api/v8/users/@me/guilds/${guild.id}`, {
                headers: { authorization: token }
              });
              console.log(chalk.blue(`Left Guild: ${guild.id}`));
            }
            showMenu();
            break;
          case '9':
            const dms = await axios.get('https://canary.discord.com/api/v8/users/@me/channels', {
              headers: { authorization: token }
            });
            for (const channel of dms.data) {
              await axios.delete(`https://canary.discord.com/api/v8/channels/${channel.id}`, {
                headers: { authorization: token }
              });
            }
            showMenu();
            break;
          case '10':
            for (let i = 0; i < 50; i++) {
              let payload = { custom_status: { text: 'xenatools', emoji_name: '🍉' } };
              await axios.patch('https://discord.com/api/v8/users/@me/settings', payload, {
                headers: { authorization: token }
              });
              await new Promise(resolve => setTimeout(resolve, 700));
              payload = { custom_status: { text: 'xenatools', emoji_name: '🥵' } };
              await axios.patch('https://discord.com/api/v8/users/@me/settings', payload, {
                headers: { authorization: token }
              });
              await new Promise(resolve => setTimeout(resolve, 700));
              payload = { custom_status: { text: 'xenatools', emoji_name: '😈' } };
              await axios.patch('https://discord.com/api/v8/users/@me/settings', payload, {
                headers: { authorization: token }
              });
              await new Promise(resolve => setTimeout(resolve, 700));
            }
            showMenu();
            break;
          case '11':
            rl.question(chalk.white('Digite a mensagem para enviar em massa: '), async (message) => {
              const massDms = await axios.get('https://canary.discord.com/api/v8/users/@me/channels', {
                headers: { authorization: token }
              });
              for (const channel of massDms.data) {
                const payload = { content: message };
                await new Promise(resolve => setTimeout(resolve, 1000));
                await axios.post(`https://canary.discord.com/api/v8/channels/${channel.id}/messages`, payload, {
                  headers: { authorization: token }
                });
                console.log(chalk.blue(`Sent DM To ${channel.id}`));
              }
              showMenu();
            });
            break;
          case '12':
            const markGuilds = await axios.get('https://discord.com/api/v8/users/@me/guilds', {
              headers: { authorization: token }
            });
            for (const guild of markGuilds.data) {
              await axios.post(`https://discord.com/api/v8/guilds/${guild.id}/ack`, {}, {
                headers: { authorization: token }
              });
              console.log(chalk.blue(guild.id));
              await new Promise(resolve => setTimeout(resolve, 10000));
            }
            showMenu();
            break;
          case '13':
            rl.question(chalk.white('Digite o Webhook URL: '), async (webhook) => {
              await axios.delete(webhook);
              console.log(chalk.blue('Webhook deletado.'));
              showMenu();
            });
            break;
          case '14':
            rl.question(chalk.white('Digite o ID do usuário para adicionar à whitelist: '), (userId) => {
              if (!whitelist.includes(userId)) {
                whitelist.push(userId);
                console.log(chalk.blue(`Usuário ${userId} adicionado à whitelist.`));
              } else {
                console.log(chalk.red(`Usuário ${userId} já está na whitelist.`));
              }
              showMenu();
            });
            break;
          case '15':
            rl.question(chalk.white('Digite o ID do usuário para remover da whitelist: '), (userId) => {
              whitelist = whitelist.filter(id => id !== userId);
              console.log(chalk.blue(`Usuário ${userId} removido da whitelist.`));
              showMenu();
            });
            break;
          default:
            console.log(chalk.red('Opção inválida.'));
            showMenu();
        }
      });
    }

    function generateRandomString(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }

    showMenu();
  });

  client.login(token).catch(console.error);
});