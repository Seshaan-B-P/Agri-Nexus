import axios from "axios";

/**
 * Weather condition code map helper
 */
export const getWeatherConditionText = (code) => {
  if (code === 0) return "Clear Sky";
  if (code >= 1 && code <= 3) return "Mainly Clear / Partly Cloudy";
  if (code >= 45 && code <= 48) return "Fog / Depositing Rime Fog";
  if (code >= 51 && code <= 55) return "Light to Heavy Drizzle";
  if (code >= 61 && code <= 65) return "Rain Showers";
  if (code >= 71 && code <= 77) return "Snow Fall / Grains";
  if (code >= 80 && code <= 82) return "Rain Showers / Violent Rain";
  if (code >= 95 && code <= 99) return "Thunderstorm / Heavy Storm";
  return "Partly Cloudy";
};

/**
 * Fetch current & 7-day weather forecast by latitude & longitude using Open-Meteo API
 * Default coordinates: Tamil Nadu (11.1271, 78.6569)
 */
export const getWeather = async (lat = 11.1271, lon = 78.6569) => {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto`
    );

    const data = response.data;
    const current = data.current;
    const daily = data.daily;

    const formattedDaily = daily && daily.time ? daily.time.map((t, idx) => ({
      date: t,
      formattedDate: new Date(t).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      tempMax: Math.round(daily.temperature_2m_max[idx]),
      tempMin: Math.round(daily.temperature_2m_min[idx]),
      rainProb: daily.precipitation_probability_max[idx] ?? 0,
      code: daily.weather_code[idx] ?? 0,
      condition: getWeatherConditionText(daily.weather_code[idx] ?? 0),
      sunrise: daily.sunrise ? daily.sunrise[idx]?.split("T")[1]?.slice(0, 5) : "--:--",
      sunset: daily.sunset ? daily.sunset[idx]?.split("T")[1]?.slice(0, 5) : "--:--",
    })) : [];

    return {
      current: current ? {
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature ?? current.temperature_2m),
        humidity: current.relative_humidity_2m ?? 65,
        precipitation: current.precipitation ?? 0,
        windspeed: Math.round(current.wind_speed_10m ?? 0),
        weathercode: current.weather_code ?? 0,
        condition: getWeatherConditionText(current.weather_code ?? 0),
      } : null,
      daily: formattedDaily,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

/**
 * Geocode location name string to latitude & longitude using Open-Meteo Geocoding API
 */
export const geocodeLocation = async (locationQuery) => {
  if (!locationQuery || !locationQuery.trim()) return null;
  try {
    const response = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        locationQuery
      )}&count=1&language=en&format=json`
    );
    if (response.data && response.data.results && response.data.results.length > 0) {
      const loc = response.data.results[0];
      return {
        name: `${loc.name}${loc.admin1 ? ", " + loc.admin1 : ""}${loc.country ? ", " + loc.country : ""}`,
        latitude: loc.latitude,
        longitude: loc.longitude,
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding location error:", error);
    return null;
  }
};
