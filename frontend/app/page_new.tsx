"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Zap, 
  Snowflake, 
  Wind, 
  Droplets, 
  Thermometer, 
  Eye, 
  Gauge,
  MapPin,
  Search,
  RefreshCw,
  TrendingUp,
  Calendar,
  Clock,
  Sunrise,
  Sunset
} from 'lucide-react';

// Types
interface CurrentWeather {
  temperature: number;
  humidity: number;
  pressure: number;
  feels_like: number;
  description: string;
  city: string;
  country: string;
  windSpeed?: number;
  visibility?: number;
  uvIndex?: number;
  sunrise?: string;
  sunset?: string;
}

interface PredictionResult {
  predicted_temperature: number;
  current_temperature: number;
  confidence: string;
}

interface ForecastDay {
  day: string;
  icon: string;
  temp: string;
  desc: string;
  condition: string;
  humidity: number;
  windSpeed: number;
}

// Weather Hook
const useWeather = () => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with enhanced mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockWeather: CurrentWeather = {
        temperature: Math.floor(Math.random() * 30) + 10,
        humidity: Math.floor(Math.random() * 40) + 40,
        pressure: Math.floor(Math.random() * 50) + 1000,
        feels_like: Math.floor(Math.random() * 30) + 12,
        description: ['Clear sky', 'Partly cloudy', 'Light rain', 'Thunderstorm', 'Snow'][Math.floor(Math.random() * 5)],
        city: city,
        country: 'Country',
        windSpeed: Math.floor(Math.random() * 20) + 5,
        visibility: Math.floor(Math.random() * 10) + 5,
        uvIndex: Math.floor(Math.random() * 10) + 1,
        sunrise: '6:30 AM',
        sunset: '7:45 PM'
      };
      
      setCurrentWeather(mockWeather);
      
      const mockPrediction: PredictionResult = {
        predicted_temperature: mockWeather.temperature + Math.floor(Math.random() * 6) - 3,
        current_temperature: mockWeather.temperature,
        confidence: ['High', 'Medium', 'Very High'][Math.floor(Math.random() * 3)]
      };
      
      setPrediction(mockPrediction);
      generateForecast(mockWeather.temperature, mockWeather.description);
      
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const generateForecast = (currentTemp: number, description: string) => {
    const days = ['Today', 'Tomorrow', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday'];
    const forecastData: ForecastDay[] = [];
    
    for (let i = 0; i < 7; i++) {
      const tempVariation = Math.floor(Math.random() * 8) - 4;
      const high = currentTemp + tempVariation + 3;
      const low = currentTemp + tempVariation - 2;
      
      const conditions = ['sunny', 'rainy', 'cloudy', 'stormy', 'snowy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      forecastData.push({
        day: days[i],
        icon: getWeatherIcon(randomCondition),
        temp: `${high}°/${low}°`,
        desc: randomCondition.charAt(0).toUpperCase() + randomCondition.slice(1),
        condition: randomCondition,
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 15) + 5
      });
    }
    
    setForecast(forecastData);
  };

  return { currentWeather, prediction, forecast, loading, error, fetchWeather };
};

// Weather Icon Component
const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('rain')) return '🌧️';
  if (lowerCondition.includes('cloud')) return '☁️';
  if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return '☀️';
  if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) return '⛈️';
  if (lowerCondition.includes('snow')) return '❄️';
  return '🌤️';
};

// Background Component
const WeatherBackground: React.FC<{ condition: string; location: string }> = ({ condition, location }) => {
  const [particles, setParticles] = useState<JSX.Element[]>([]);
  
  useEffect(() => {
    const createParticles = () => {
      const newParticles: JSX.Element[] = [];
      const lowerCondition = condition.toLowerCase();
      
      if (lowerCondition.includes('rain') || lowerCondition.includes('storm')) {
        // Rain particles
        for (let i = 0; i < 100; i++) {
          newParticles.push(
            <div
              key={`rain-${i}`}
              className="absolute w-0.5 h-4 bg-gradient-to-b from-transparent to-blue-200 opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animation: `rainDrop ${Math.random() * 0.5 + 0.5}s linear infinite`
              }}
            />
          );
        }
      }
      
      if (lowerCondition.includes('snow')) {
        // Snow particles
        for (let i = 0; i < 50; i++) {
          newParticles.push(
            <div
              key={`snow-${i}`}
              className="absolute text-white opacity-70 pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 10 + 10}px`,
                animationDelay: `${Math.random() * 8}s`,
                animation: `snowFall ${Math.random() * 3 + 8}s linear infinite`
              }}
            >
              ❄
            </div>
          );
        }
      }
      
      if (lowerCondition.includes('cloud')) {
        // Floating clouds
        for (let i = 0; i < 5; i++) {
          newParticles.push(
            <div
              key={`cloud-${i}`}
              className="absolute text-4xl opacity-20 pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 10}s`,
                animation: `float ${Math.random() * 20 + 20}s linear infinite`
              }}
            >
              ☁️
            </div>
          );
        }
      }
      
      setParticles(newParticles);
    };
    
    createParticles();
  }, [condition]);
  
  const getBackgroundClass = () => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('storm')) {
      return 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900';
    }
    if (lowerCondition.includes('snow')) {
      return 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300';
    }
    if (lowerCondition.includes('cloud')) {
      return 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600';
    }
    // Sunny/Clear
    return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
  };

  return (
    <>
      <div className={`fixed inset-0 transition-all duration-1000 ${getBackgroundClass()}`}>
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        {particles}
      </div>
      <style jsx>{`
        @keyframes rainDrop {
          to { transform: translateY(100vh); }
        }
        @keyframes snowFall {
          to { transform: translateY(100vh) rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(50px); }
        }
      `}</style>
    </>
  );
};

// Header Component
const Header: React.FC = () => {
  return (
    <header className="text-center text-white mb-12 relative">
      <div className="mb-4">
        <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
          WeatherAI
        </h1>
        <p className="text-xl md:text-2xl opacity-90 font-light">
          Precision Weather Forecasting with Machine Learning
        </p>
      </div>
      
      <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg animate-bounce">
        🤖 AI Powered
      </div>
    </header>
  );
};

// Location Search Component
const LocationSearch: React.FC<{
  onLocationChange: (location: string) => void;
  currentLocation: string;
}> = ({ onLocationChange, currentLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const popularCities = [
    'New York', 'London', 'Tokyo', 'Sydney', 'Mumbai', 
    'Paris', 'Dubai', 'Singapore', 'Toronto', 'Berlin'
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onLocationChange(searchQuery.trim());
      setSearchQuery('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-center mb-6">
        <div className={`relative transition-all duration-300 ${isExpanded ? 'w-80' : 'w-60'}`}>
          <input
            type="text"
            className="w-full bg-white bg-opacity-10 backdrop-blur-lg border-2 border-white border-opacity-30 text-white placeholder-white placeholder-opacity-70 px-6 py-4 pr-16 rounded-full focus:outline-none focus:border-opacity-60 focus:bg-opacity-20 transition-all duration-300"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setTimeout(() => setIsExpanded(false), 200)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            onClick={handleSearch}
          >
            <Search size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
        {popularCities.map((city) => (
          <button
            key={city}
            className={`px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
              currentLocation === city
                ? 'bg-white bg-opacity-30 shadow-lg ring-2 ring-white ring-opacity-50'
                : 'bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm'
            } text-white font-medium`}
            onClick={() => onLocationChange(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

// Current Weather Component
const CurrentWeather: React.FC<{
  weather: CurrentWeather;
  location: string;
}> = ({ weather, location }) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-8 mb-8 text-white border border-white border-opacity-20 shadow-2xl hover:bg-opacity-15 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MapPin className="text-blue-300" size={24} />
          <h2 className="text-3xl font-bold">{weather.city}, {weather.country}</h2>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-75 mb-1">
            <Clock size={16} className="inline mr-1" />
            Updated now
          </div>
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
          <p className="text-lg opacity-75">
            Feels like {Math.round(weather.feels_like)}°C
          </p>
        </div>
        
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center backdrop-blur-sm">
              <Droplets className="mx-auto mb-2 text-blue-300" size={32} />
              <div className="text-2xl font-bold">{weather.humidity}%</div>
              <div className="text-sm opacity-75">Humidity</div>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center backdrop-blur-sm">
              <Wind className="mx-auto mb-2 text-green-300" size={32} />
              <div className="text-2xl font-bold">{weather.windSpeed || 12} km/h</div>
              <div className="text-sm opacity-75">Wind Speed</div>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center backdrop-blur-sm">
              <Gauge className="mx-auto mb-2 text-purple-300" size={32} />
              <div className="text-2xl font-bold">{weather.pressure} mb</div>
              <div className="text-sm opacity-75">Pressure</div>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center backdrop-blur-sm">
              <Eye className="mx-auto mb-2 text-cyan-300" size={32} />
              <div className="text-2xl font-bold">{weather.visibility || 10} km</div>
              <div className="text-sm opacity-75">Visibility</div>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center backdrop-blur-sm">
              <Sunrise className="mx-auto mb-2 text-orange-300" size={32} />
              <div className="text-2xl font-bold">{weather.sunrise || '6:30'}</div>
              <div className="text-sm opacity-75">Sunrise</div>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-2xl p-4 text-center backdrop-blur-sm">
              <Sunset className="mx-auto mb-2 text-pink-300" size={32} />
              <div className="text-2xl font-bold">{weather.sunset || '19:45'}</div>
              <div className="text-sm opacity-75">Sunset</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Prediction Component
const PredictionDisplay: React.FC<{ prediction: PredictionResult }> = ({ prediction }) => {
  const tempDiff = prediction.predicted_temperature - prediction.current_temperature;
  const isWarmer = tempDiff > 0;
  
  return (
    <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-3xl p-8 text-white shadow-2xl hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            🤖
          </div>
          <h3 className="text-2xl font-bold">AI Weather Prediction</h3>
        </div>
        <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
          <TrendingUp size={16} />
          <span className="text-sm font-medium">Confidence: {prediction.confidence}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2 animate-pulse">
            {Math.round(prediction.predicted_temperature)}°C
          </div>
          <p className="text-lg opacity-90">Next Hour Prediction</p>
        </div>
        
        <div className="text-center">
          <div className={`text-3xl font-bold mb-2 ${isWarmer ? 'text-red-300' : 'text-blue-300'}`}>
            {isWarmer ? '+' : ''}{tempDiff.toFixed(1)}°C
          </div>
          <p className="text-lg opacity-90">Expected Change</p>
        </div>
        
        <div className="text-center">
          <div className="text-3xl mb-2">
            {isWarmer ? '📈' : '📉'}
          </div>
          <p className="text-lg opacity-90">
            {isWarmer ? 'Getting Warmer' : 'Getting Cooler'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Forecast Card Component
const ForecastCard: React.FC<{ forecast: ForecastDay; index: number }> = ({ forecast, index }) => {
  return (
    <div 
      className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 text-center text-white border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="font-bold text-lg mb-3 opacity-90">{forecast.day}</div>
      <div className="text-5xl mb-4 hover:scale-110 transition-transform duration-300">
        {forecast.icon}
      </div>
      <div className="text-2xl font-bold mb-2">{forecast.temp}</div>
      <div className="text-sm opacity-80 mb-3">{forecast.desc}</div>
      
      <div className="grid grid-cols-2 gap-2 text-xs opacity-75">
        <div className="flex items-center justify-center space-x-1">
          <Droplets size={12} />
          <span>{forecast.humidity}%</span>
        </div>
        <div className="flex items-center justify-center space-x-1">
          <Wind size={12} />
          <span>{forecast.windSpeed}km/h</span>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const WeatherApp: React.FC = () => {
  const [location, setLocation] = useState('New York');
  const { currentWeather, prediction, forecast, loading, error, fetchWeather } = useWeather();

  useEffect(() => {
    fetchWeather(location);
  }, [location]);

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handleRefresh = () => {
    fetchWeather(location);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <WeatherBackground 
        condition={currentWeather?.description || 'clear'} 
        location={location}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <Header />
        
        <LocationSearch 
          onLocationChange={handleLocationChange} 
          currentLocation={location}
        />

        {loading ? (
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 mb-4">
              <RefreshCw className="animate-spin" size={32} />
            </div>
            <p className="text-2xl font-light">Analyzing weather patterns...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500 bg-opacity-20 border border-red-400 border-opacity-50 backdrop-blur-xl rounded-2xl p-6 text-white text-center">
            <p className="text-xl mb-4">⚠️ {error}</p>
            <button 
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors font-semibold"
              onClick={handleRefresh}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {currentWeather && (
              <CurrentWeather 
                weather={currentWeather} 
                location={location}
              />
            )}
            
            {prediction && (
              <PredictionDisplay prediction={prediction} />
            )}
            
            {forecast.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center space-x-3">
                  <Calendar size={32} />
                  <span>7-Day Forecast</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                  {forecast.map((day, index) => (
                    <ForecastCard key={index} forecast={day} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WeatherApp;
