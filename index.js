'use strict';

const { checkEnv } = require('./utils');
const { login, getDates, isDateAvailable } = require('./api');
const TelegramBot = require('node-telegram-bot-api');

const TELEGRAM_BOT_TOKEN = checkEnv('TELEGRAM_BOT_TOKEN');
const TELEGRAM_CHAT_ID = checkEnv('TELEGRAM_CHAT_ID');
const USERNAME = checkEnv('USERNAME');
const PASSWORD = checkEnv('PASSWORD');
const TARGA = checkEnv('TARGA');
const TIPO_VEICOLO = checkEnv('TIPO_VEICOLO');
const ID_PRATICA = checkEnv('ID_PRATICA');
const ID_UFFICIO_PRA = checkEnv('ID_UFFICIO_PRA');

async function main() {
    const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {polling: true});
    bot.sendMessage(TELEGRAM_CHAT_ID, `Sono operativo!`);

    while(true) {
        const access_token = await login(USERNAME, PASSWORD);

        const date = await getDates(access_token, ID_UFFICIO_PRA);
        for (let data of date) {
            if (await isDateAvailable(access_token, data, ID_UFFICIO_PRA, ID_PRATICA, TARGA, TIPO_VEICOLO)) {
                bot.sendMessage(TELEGRAM_CHAT_ID, `Disponibile ${data}`);
            }
        }
        await sleep(60000)
    }
}

main().catch(console.error);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 
