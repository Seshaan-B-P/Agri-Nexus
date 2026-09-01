import { useEffect, useState } from "react";
import {
  FaCloudSunRain,
  FaTemperatureHigh,
  FaTint,
  FaWind,
  FaExclamationTriangle,
  FaLightbulb,
  FaMapMarkerAlt,
  FaSun,
  FaSearch,
  FaSync,
  FaThermometerHalf,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { getFarms } from "../services/farmService";
import { getProfile } from "../services/authService";
import { getWeather, geocodeLocation } from "../services/weatherService";

function WeatherForecast() {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [locationName, setLocationName] = useState("Tamil Nadu, India");
  const [customSearch, setCustomSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    loadInitialLocationAndWeather();
  }, []);

  const loadInitialLocationAndWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user farms and profile to identify default location
      const [farmRes, profileRes] = await Promise.allSettled([
        getFarms(),
        getProfile(),
      ]);

      const userFarms =
        farmRes.status === "fulfilled" ? farmRes.value.farms || [] : [];
      setFarms(userFarms);

      let lat = 11.1271;
      let lon = 78.6569;
      let name = "Tamil Nadu, India";

      // 1. Check if first farm has valid coordinates or location
      if (userFarms.length > 0) {
        const firstFarm = userFarms[0];
        setSelectedFarm(firstFarm);

        if (firstFarm.latitude && firstFarm.longitude) {
          lat = firstFarm.latitude;
          lon = firstFarm.longitude;
          name = `${firstFarm.farmName} (${firstFarm.location})`;
        } else if (firstFarm.location) {
          name = `${firstFarm.farmName} (${firstFarm.location})`;
          const geo = await geocodeLocation(firstFarm.location);
          if (geo) {
            lat = geo.latitude;
            lon = geo.longitude;
          }
        }
      } else if (profileRes.status === "fulfilled" && profileRes.value.user) {
        // 2. Check profile location
        const u = profileRes.value.user;
        const profileLocStr = [u.village, u.district, u.state]
          .filter(Boolean)
          .join(", ");
        if (profileLocStr) {
          const geo = await geocodeLocation(profileLocStr);
          if (geo) {
            lat = geo.latitude;
            lon = geo.longitude;
            name = geo.name;
          }
        }
      }

      setLocationName(name);
      await fetchWeatherData(lat, lon);
    } catch (err) {
      console.error("Initial weather load error:", err);
      setError("Failed to fetch weather data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async (lat, lon) => {
    try {
      setError(null);
      const data = await getWeather(lat, lon);

      if (!data || !data.current) {
        setError("Weather data currently unavailable for this location.");
        setCurrent(null);
        setForecast([]);
        return;
      }

      setCurrent(data.current);
      setForecast(data.daily || []);
    } catch (err) {
      console.error("Fetch weather error:", err);
      setError("Network or API error while connecting to weather service.");
    }
  };

  const handleFarmSelect = async (farmId) => {
    if (!farmId) return;
    const farm = farms.find((f) => f._id === farmId);
    if (!farm) return;

    setSelectedFarm(farm);
    setLoading(true);

    let lat = farm.latitude || 11.1271;
    let lon = farm.longitude || 78.6569;
    let name = `${farm.farmName} (${farm.location})`;

    if (!farm.latitude || !farm.longitude) {
      const geo = await geocodeLocation(farm.location);
      if (geo) {
        lat = geo.latitude;
        lon = geo.longitude;
      }
    }

    setLocationName(name);
    await fetchWeatherData(lat, lon);
    setLoading(false);
  };

  const handleCustomSearch = async (e) => {
    e.preventDefault();
    if (!customSearch.trim()) return;

    try {
      setSearching(true);
      const geo = await geocodeLocation(customSearch);
      if (geo) {
        setSelectedFarm(null);
        setLocationName(geo.name);
        await fetchWeatherData(geo.latitude, geo.longitude);
        setCustomSearch("");
        toast.success(`Weather loaded for ${geo.name}`);
      } else {
        toast.error("Location not found. Please try entering state or district.");
      }
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Error searching location.");
    } finally {
      setSearching(false);
    }
  };

  // Generate Smart Farming Advisory Tips
  const generateAdvisories = () => {
    if (!forecast.length && !current) return [];

    const tips = [];
    const maxRainToday = forecast[0]?.rainProb || current?.precipitation || 0;
    const maxTempToday = forecast[0]?.tempMax || current?.temperature || 30;
    const humidityToday = current?.humidity || 65;
    const windToday = current?.windspeed || 0;

    // High rainfall advisory
    if (maxRainToday >= 50 || current?.precipitation > 5) {
      tips.push({
        type: "warning",
        title: "High Rainfall Expected",
        desc: "Heavy rain is expected. Avoid unnecessary irrigation and check field drainage to prevent waterlogging.",
      });
    } else {
      tips.push({
        type: "success",
        title: "Favorable Irrigation & Spray Window",
        desc: "Low probability of precipitation. Suitable window for foliar nutrient sprays and scheduled irrigation.",
      });
    }

    // High temperature advisory
    if (maxTempToday >= 35) {
      tips.push({
        type: "warning",
        title: "High Temperature Advisory",
        desc: `High temperature (${maxTempToday}°C) expected. Monitor soil moisture closely and irrigate according to crop water requirements to avoid thermal stress.`,
      });
    }

    // High humidity advisory
    if (humidityToday >= 80) {
      tips.push({
        type: "warning",
        title: "High Humidity & Disease Monitoring",
        desc: `High humidity (${humidityToday}%) may create conditions favorable for fungal spore proliferation. Inspect plant leaves regularly for early signs of blight or mildew.`,
      });
    }

    // High wind speed advisory
    if (windToday > 25) {
      tips.push({
        type: "info",
        title: "Wind Velocity Alert",
        desc: `High wind speed detected (${windToday} km/h). Postpone pesticide spraying to prevent severe drift.`,
      });
    }

    return tips;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="text-sm font-bold text-slate-500">Fetching live weather data...</p>
      </div>
    );
  }

  const advisories = generateAdvisories();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <FaCloudSunRain className="text-amber-500" /> Weather Forecast
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time hyper-local weather conditions & 7-day agricultural advisories.
          </p>
        </div>

        {/* Location Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Farm Dropdown */}
          {farms.length > 0 && (
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs">
              <FaMapMarkerAlt className="text-red-500 text-xs" />
              <select
                value={selectedFarm?._id || ""}
                onChange={(e) => handleFarmSelect(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
              >
                <option value="" disabled>
                  Select Farm Location
                </option>
                {farms.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.farmName} ({f.location})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search Box */}
          <form
            onSubmit={handleCustomSearch}
            className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs"
          >
            <input
              type="text"
              placeholder="Search village/district..."
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-slate-800 outline-none w-36 sm:w-44"
            />
            <button
              type="submit"
              disabled={searching}
              className="bg-emerald-600 text-white px-3 py-2 text-xs font-bold hover:bg-emerald-700 transition"
            >
              {searching ? <FaSync className="animate-spin" /> : <FaSearch />}
            </button>
          </form>
        </div>
      </div>

      {/* Error state alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-red-500 text-xl" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
          <button
            onClick={loadInitialLocationAndWeather}
            className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Live Weather Card */}
      {current && (
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                <FaMapMarkerAlt /> {locationName}
              </div>
              <div className="flex items-baseline gap-4">
                <h2 className="text-5xl sm:text-6xl font-black">
                  {current.temperature}°C
                </h2>
                <span className="text-lg text-emerald-200 font-bold">
                  {current.condition}
                </span>
              </div>
              <p className="text-xs text-emerald-100 flex items-center gap-2">
                <FaThermometerHalf /> Feels like: {current.feelsLike}°C
              </p>
            </div>

            {/* Sun Info Box */}
            {forecast.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/20 flex items-center gap-6">
                <div className="text-center">
                  <p className="text-[10px] font-extrabold uppercase text-emerald-200 flex items-center justify-center gap-1">
                    <FaSun className="text-amber-400" /> Sunrise
                  </p>
                  <p className="text-sm font-black mt-1">
                    {forecast[0]?.sunrise || "--:--"}
                  </p>
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="text-center">
                  <p className="text-[10px] font-extrabold uppercase text-emerald-200 flex items-center justify-center gap-1">
                    <FaSun className="text-amber-500" /> Sunset
                  </p>
                  <p className="text-sm font-black mt-1">
                    {forecast[0]?.sunset || "--:--"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Current Metrics Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold uppercase text-emerald-200 flex items-center gap-1.5">
                <FaTint className="text-blue-300" /> Humidity
              </p>
              <p className="text-xl font-black mt-1">{current.humidity}%</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold uppercase text-emerald-200 flex items-center gap-1.5">
                <FaCloudSunRain className="text-cyan-300" /> Rainfall
              </p>
              <p className="text-xl font-black mt-1">{current.precipitation} mm</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold uppercase text-emerald-200 flex items-center gap-1.5">
                <FaWind className="text-teal-200" /> Wind Speed
              </p>
              <p className="text-xl font-black mt-1">{current.windspeed} km/h</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold uppercase text-emerald-200 flex items-center gap-1.5">
                <FaTint className="text-blue-400" /> Rain Chance
              </p>
              <p className="text-xl font-black mt-1">
                {forecast[0]?.rainProb ?? 0}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Extended Forecast */}
      {forecast.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <FaTemperatureHigh className="text-emerald-600" /> 7-Day Weather Forecast
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {forecast.map((day, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl p-4 border shadow-xs text-center space-y-2 transition-all ${
                  idx === 0
                    ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <p className="text-xs font-black text-slate-800">
                  {idx === 0 ? "Today" : day.formattedDate}
                </p>
                <div className="text-2xl py-1">
                  {day.rainProb > 40 ? "🌧️" : day.tempMax > 34 ? "☀️" : "⛅"}
                </div>
                <p className="text-[11px] font-bold text-slate-600 line-clamp-1">
                  {day.condition}
                </p>
                <div className="text-xs font-black text-slate-800">
                  <span>{day.tempMax}°</span>{" "}
                  <span className="text-slate-400 font-normal text-[10px]">
                    {day.tempMin}°
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1 text-[10px] font-black text-blue-600 bg-blue-50 py-1 rounded-lg">
                  <FaTint className="text-[9px]" /> {day.rainProb}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Farming Advisory Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl">
            <FaLightbulb />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Smart Farming Advisory</h2>
            <p className="text-xs text-slate-400">
              Actionable agricultural guidance derived from current weather data
            </p>
          </div>
        </div>

        {advisories.length === 0 ? (
          <p className="text-xs text-slate-400">No specific advisories generated.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advisories.map((adv, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border space-y-2 ${
                  adv.type === "warning"
                    ? "bg-red-50/80 border-red-200 text-red-900"
                    : adv.type === "success"
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                    : "bg-blue-50/80 border-blue-200 text-blue-900"
                }`}
              >
                <h3 className="font-extrabold text-xs flex items-center gap-1.5">
                  {adv.type === "warning" ? (
                    <FaExclamationTriangle className="text-red-500" />
                  ) : (
                    <FaLightbulb />
                  )}
                  {adv.title}
                </h3>
                <p className="text-xs leading-relaxed opacity-90">{adv.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherForecast;
