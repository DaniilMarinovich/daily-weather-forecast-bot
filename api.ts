import axios from "axios";

import "dotenv/config";

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

if (!WEATHER_API_KEY) throw new Error("Cannot find api key");

export async function getWeatherNow(city: string) {
  try {
    const url = "https://api.openweathermap.org/data/2.5/weather";

    const response = await axios.get(url, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: "metric",
        lang: "ru",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function getWeatherDay(city: string) {
  try {
    const url = "https://api.openweathermap.org/data/2.5/forecast";

    const response = await axios.get(url, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: "metric",
        lang: "ru",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error: ", error);
  }
}