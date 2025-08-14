import React from 'react';

export interface CurrentWeatherProps {
  weather: {
    temperature: number;
    humidity: number;
    pressure: number;
    feels_like: number;
    description: string;
    city: string;
    country: string;
    windSpeed?: number;
    visibility?: number;
    sunrise?: string;
    sunset?: string;
  };
  location: string;
}

const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('rain')) return '🌧️';
  if (lowerCondition.includes('cloud')) return '☁️';
  if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return '☀️';
  if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) return '⛈️';
  if (lowerCondition.includes('snow')) return '❄️';
  return '🌤️';
};

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather }) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-8 mb-8 text-white border border-white border-opacity-20 shadow-2xl hover:bg-opacity-15 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-blue-300 text-2xl">📍</span>
          <h2 className="text-3xl font-bold">{weather.city}, {weather.country}</h2>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-75 mb-1">Updated now</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">
            {getWeatherIcon(weather.description)}
          </div>
          <div className="text-7xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            {Math.round(weather.temperature)}°C
          </div>
          <p className="text-xl opacity-90 mb-2">{weather.description}</p>
          <p className="text-lg opacity-75">Feels like {Math.round(weather.feels_like)}°C</p>
        </div>
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center backdrop-blur-sm">
              <span className="text-blue-300 text-2xl">💧</span>
              <div className="text-2xl font-bold">{weather.humidity}%</div>
              <div className="text-sm opacity-75">Humidity</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center backdrop-blur-sm">
              <span className="text-green-300 text-2xl">🌬️</span>
              <div className="text-2xl font-bold">{weather.windSpeed || 12} km/h</div>
              <div className="text-sm opacity-75">Wind Speed</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center backdrop-blur-sm">
              <span className="text-purple-300 text-2xl">🧭</span>
              <div className="text-2xl font-bold">{weather.pressure} mb</div>
              <div className="text-sm opacity-75">Pressure</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center backdrop-blur-sm">
              <span className="text-cyan-300 text-2xl">👁️</span>
              <div className="text-2xl font-bold">{weather.visibility || 10} km</div>
              <div className="text-sm opacity-75">Visibility</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center backdrop-blur-sm">
              <span className="text-orange-300 text-2xl">🌅</span>
              <div className="text-2xl font-bold">{weather.sunrise || '6:30'}</div>
              <div className="text-sm opacity-75">Sunrise</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center backdrop-blur-sm">
              <span className="text-pink-300 text-2xl">🌇</span>
              <div className="text-2xl font-bold">{weather.sunset || '19:45'}</div>
              <div className="text-sm opacity-75">Sunset</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
