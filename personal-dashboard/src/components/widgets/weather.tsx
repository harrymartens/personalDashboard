import { useEffect, useState } from "react";

interface WeatherData {
  main: {
    feels_like: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

const weatherIcons = {
  "01d": "clear-day.svg",
  "01n": "clear-night.svg",
  "02d": "cloudy-1-day.svg",
  "02n": "cloudy-1-night.svg",
  "03d": "cloudy-2-day.svg",
  "03n": "cloudy-2-night.svg",
  "04d": "cloudy-3-day.svg",
  "04n": "cloudy-3-night.svg",
  "09d": "rainy-1.svg",
  "09n": "rainy-1.svg",
  "10d": "rainy-1-day.svg",
  "10n": "rainy-1-night.svg",
  "11d": "isolated-thunderstorms-day.svg",
  "11n": "isolated-thunderstorms-night.svg",
  "13d": "frost-day.svg",
  "13n": "frost-night.svg",
  "50d": "fog-day.svg",
  "50n": "fog-night.svg",
  // Add other mappings as needed for extreme weather icons
};

function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Replace YOUR_API_KEY with your actual OpenWeatherMap API key
  const API_KEY = "fb0ae623dab6ffa38ae31a2cf9ee6663";
  const lat = -33.8688; // Sydney latitude
  const lon = 151.2093; // Sydney longitude

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&exclude=current,minute,hourly&units=metric`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon, API_KEY]);

  // Prevent further execution until the API call is complete
  if (isLoading) {
    return <div>Loading weather data...</div>;
  }

  if (!weather) {
    return <div>Error fetching weather data.</div>;
  }

  // Extract the required properties once the data is available
  const dailyTemp = weather.main.feels_like;
  const weatherDesc = weather.weather[0].description;
  const weatherIconId = weather.weather[0].icon;
  const weatherAnimation =
    weatherIcons[weatherIconId as keyof typeof weatherIcons];


  return (
    <div className="flex flex-row items-center gap-2">
      <img
        className="size-20 pt-3"
        src={`./weatherIcons/${weatherAnimation}`} // Adjust the path as needed
        alt="Weather Icon"
      />
      <div className="flex flex-col">
        <a className="">{Math.round(dailyTemp)}°C</a>
        <a className="text-sml font-light">{titleCase(weatherDesc)}</a>
      </div>
    </div>
  );
};

export default WeatherWidget;
