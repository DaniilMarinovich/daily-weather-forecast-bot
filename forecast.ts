function checkToday(day: Date): boolean {
  const today = new Date();
  return (
    today.getDate() === day.getDate() || today.getDate() + 1 === day.getDate()
  );
}

function filterTodayForecast(data: any) {
  return data.list.filter((forecast: any) => {
    const day = new Date(forecast.dt_txt);
    return checkToday(day);
  });
}

function formatForecast(todayForecasts: any): string {
  return todayForecasts
    .map((forecast: any) => {
      const time = forecast.dt_txt.slice(11, 16);

      const temp = Math.round(forecast.main.temp);

      const description = forecast.weather[0].description;

      return `${time}: ${temp}°C, ${description}`;
    })
    .join("\n");
}

export function getForecast(data: any): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return (
    `Прогноз погоды в Гомеле на сегодня(${today.getDate()}.${today.getMonth()}}) и завтра(${tomorrow.getDate()}.${tomorrow.getMonth()}}):\n` +
    formatForecast(filterTodayForecast(data))
  );
}
