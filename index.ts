import express from 'express';
import { bot } from "./telegram";
import cron from "node-cron";
import { getWeatherDay } from "./api";
import { initDB, saveUser, getUsers } from "./db";
import { getForecast } from "./forecast";

let cachedWeather: string = "";

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running and weather is forecasting! 🌤️');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function updateWeatherCache() {
  try {
    const data = await getWeatherDay("Homel");
    cachedWeather = getForecast(data);
  } catch (e) {
    console.error("Error while update weather", e);
  }
}

async function getOrLoadWeather() {
  if (cachedWeather === "") {
    await updateWeatherCache();
  }

  return cachedWeather;
}

async function start() {
  const db = await initDB();

  cron.schedule("0 0 * * *", async () => {
    await updateWeatherCache();
  });

  cron.schedule("0 6 * * *", async () => {
    try {
      const users = await getUsers();
      const message = await getOrLoadWeather();

      users.forEach(async (user) => {
        await bot.sendMessage(user.chatId, message);
      });
    } catch (e) {
      console.error("Error in mailing", e);
    }
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const message = await getOrLoadWeather();

    try {
      await saveUser(chatId);
    } catch (e) {
      console.error(e);
    }

    bot.sendMessage(chatId, message);
  });

  await updateWeatherCache();
}

start();
