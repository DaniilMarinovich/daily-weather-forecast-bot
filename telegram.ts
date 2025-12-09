import "dotenv/config";
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.BOT_TOKEN;

if(!token) throw new Error("Cannot find token");

export const bot = new TelegramBot(token, {polling: true});