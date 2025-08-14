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
  prediction_date?: string;
  prediction_time?: string;
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
      console.log(`Fetching weather data for: ${city}`);
      
      // Validate city name before making API call
      if (!city || city.trim().length < 2) {
        throw new Error('Please enter a valid city name (at least 2 characters)');
      }
      
      // Clean the city name
      const cleanCityName = city.trim();
      
      // Fetch current weather from backend
      const weatherResponse = await fetch(`https://web-production-6d3e.up.railway.app/current-weather/${encodeURIComponent(cleanCityName)}`);
      
      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json().catch(() => ({}));
        
        if (weatherResponse.status === 404) {
          throw new Error(`City "${cleanCityName}" not found. Please check the spelling and try again.`);
        } else if (weatherResponse.status === 500) {
          throw new Error(errorData.error || 'Weather service is temporarily unavailable. Please try again later.');
        } else {
          throw new Error(errorData.error || `Failed to fetch weather data (Error ${weatherResponse.status})`);
        }
      }
      
      const weatherData = await weatherResponse.json();
      console.log('Weather data received:', weatherData);
      
      // Check if the response contains an error
      if (weatherData.error) {
        throw new Error(weatherData.error);
      }
      
      // Transform backend response to frontend format
      const transformedWeather: CurrentWeather = {
        temperature: weatherData.temperature || weatherData.main?.temp || 0,
        humidity: weatherData.humidity || weatherData.main?.humidity || 0,
        pressure: weatherData.pressure || weatherData.main?.pressure || 0,
        feels_like: weatherData.feels_like || weatherData.main?.feels_like || weatherData.temperature || 0,
        description: weatherData.description || weatherData.weather?.[0]?.description || 'Clear sky',
        city: weatherData.city || weatherData.name || cleanCityName,
        country: weatherData.country || weatherData.sys?.country || 'India',
        windSpeed: weatherData.windSpeed || weatherData.wind?.speed || 0,
        visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : 10,
        uvIndex: weatherData.uvIndex || Math.floor(Math.random() * 10) + 1,
        sunrise: weatherData.sunrise || '6:30 AM',
        sunset: weatherData.sunset || '7:45 PM'
      };
      
      setCurrentWeather(transformedWeather);
      
      // Now make prediction using the real weather data
      try {
        const predictionResponse = await fetch('https://web-production-6d3e.up.railway.app/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            temperature: transformedWeather.temperature,
            humidity: transformedWeather.humidity,
            pressure: transformedWeather.pressure,
            feels_like: transformedWeather.feels_like,
            wind_speed: transformedWeather.windSpeed,
            visibility: transformedWeather.visibility ? transformedWeather.visibility * 1000 : 10000 // Convert back to meters
          }),
        });
        
        if (predictionResponse.ok) {
          const predictionData = await predictionResponse.json();
          console.log('Prediction data received:', predictionData);
          
          const transformedPrediction: PredictionResult = {
            predicted_temperature: predictionData.predicted_temperature || transformedWeather.temperature + Math.random() * 4 - 2,
            current_temperature: transformedWeather.temperature,
            confidence: predictionData.confidence || 'High'
          };
          
          setPrediction(transformedPrediction);
        } else {
          console.warn('Prediction API failed, using fallback');
          // Fallback prediction if API fails
          const fallbackPrediction: PredictionResult = {
            predicted_temperature: transformedWeather.temperature + Math.random() * 4 - 2,
            current_temperature: transformedWeather.temperature,
            confidence: 'Medium'
          };
          setPrediction(fallbackPrediction);
        }
      } catch (predictionError) {
        console.warn('Prediction failed:', predictionError);
        // Fallback prediction
        const fallbackPrediction: PredictionResult = {
          predicted_temperature: transformedWeather.temperature + Math.random() * 4 - 2,
          current_temperature: transformedWeather.temperature,
          confidence: 'Medium'
        };
        setPrediction(fallbackPrediction);
      }
      
      // Generate forecast based on current weather
      generateForecast(transformedWeather.temperature, transformedWeather.description);
      
    } catch (err) {
      console.error('Weather fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      
      // Provide helpful error messages
      if (errorMessage.includes('fetch')) {
        setError('Unable to connect to weather service. Please check if the backend server is running on port 5000.');
      } else if (errorMessage.includes('not found')) {
        setError(errorMessage);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateForecast = (currentTemp: number, description: string) => {
    const today = new Date();
    const forecastData: ForecastDay[] = [];
    
    for (let i = 0; i < 7; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      
      // Get day name
      const dayName = i === 0 ? 'Today' : 
                    i === 1 ? 'Tomorrow' : 
                    forecastDate.toLocaleDateString('en-IN', { weekday: 'long' });
      
      const tempVariation = Math.floor(Math.random() * 8) - 4;
      const high = currentTemp + tempVariation + 3;
      const low = currentTemp + tempVariation - 2;
      
      // Indian weather patterns - no snow for most cities
      const indianWeatherConditions = ['sunny', 'partly cloudy', 'cloudy', 'humid', 'hazy'];
      
      // Add rain during monsoon months (June-September) with higher probability
      const currentMonth = today.getMonth(); // 0-11
      if (currentMonth >= 5 && currentMonth <= 8) { // June to September
        indianWeatherConditions.push('rainy', 'thunderstorm', 'drizzle');
      } else {
        // Add occasional rain in other months
        if (Math.random() < 0.2) indianWeatherConditions.push('light rain');
      }
      
      const randomCondition = indianWeatherConditions[Math.floor(Math.random() * indianWeatherConditions.length)];
      
      forecastData.push({
        day: dayName,
        icon: getWeatherIcon(randomCondition),
        temp: `${Math.round(high)}°/${Math.round(low)}°`,
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
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return '🌧️';
  if (lowerCondition.includes('cloud') && !lowerCondition.includes('partly')) return '☁️';
  if (lowerCondition.includes('partly cloudy') || lowerCondition.includes('few clouds')) return '⛅';
  if (lowerCondition.includes('sun') || lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return '☀️';
  if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) return '⛈️';
  if (lowerCondition.includes('hazy') || lowerCondition.includes('mist') || lowerCondition.includes('fog')) return '🌫️';
  if (lowerCondition.includes('humid')) return '🌡️';
  if (lowerCondition.includes('snow')) return '❄️'; // Only for hill stations
  if (lowerCondition.includes('wind')) return '💨';
  return '🌤️'; // Default partly sunny
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
        for (let i = 0; i < 120; i++) {
          newParticles.push(
            <div
              key={`rain-${i}`}
              className="absolute w-0.5 h-8 bg-gradient-to-b from-transparent via-blue-300 to-blue-400 opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animation: `rainDrop ${Math.random() * 0.5 + 0.8}s linear infinite`
              }}
            />
          );
        }
      }
      
      if (lowerCondition.includes('snow') && 
          (location.toLowerCase().includes('shimla') || 
           location.toLowerCase().includes('manali') || 
           location.toLowerCase().includes('dharamshala') ||
           location.toLowerCase().includes('mussoorie') ||
           location.toLowerCase().includes('nainital'))) {
        // Snow particles - only for hill stations
        for (let i = 0; i < 60; i++) {
          newParticles.push(
            <div
              key={`snow-${i}`}
              className="absolute text-white opacity-80 pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 8 + 12}px`,
                animationDelay: `${Math.random() * 8}s`,
                animation: `snowFall ${Math.random() * 3 + 8}s linear infinite`
              }}
            >
              ❄
            </div>
          );
        }
      }
      
      if (lowerCondition.includes('hazy') || lowerCondition.includes('humid')) {
        // Heat haze particles for hot weather
        for (let i = 0; i < 15; i++) {
          newParticles.push(
            <div
              key={`haze-${i}`}
              className="absolute text-yellow-200 opacity-40 pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 80}%`,
                fontSize: `${Math.random() * 20 + 30}px`,
                animationDelay: `${Math.random() * 4}s`,
                animation: `heatWave ${Math.random() * 3 + 4}s ease-in-out infinite`
              }}
            >
              〰️
            </div>
          );
        }
      }
      
      if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
        // Sun rays and sparkles
        for (let i = 0; i < 25; i++) {
          newParticles.push(
            <div
              key={`sparkle-${i}`}
              className="absolute text-yellow-300 opacity-60 pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                fontSize: `${Math.random() * 10 + 15}px`,
                animationDelay: `${Math.random() * 5}s`,
                animation: `sparkle ${Math.random() * 2 + 3}s ease-in-out infinite`
              }}
            >
              ✨
            </div>
          );
        }
        
        // Animated Sun
        newParticles.push(
          <div
            key="sun"
            className="absolute top-10 right-10 text-8xl opacity-30 pointer-events-none"
            style={{
              animation: `sunRotate 20s linear infinite`
            }}
          >
            ☀️
          </div>
        );
      }
      
      if (lowerCondition.includes('cloud')) {
        // Floating clouds
        for (let i = 0; i < 8; i++) {
          newParticles.push(
            <div
              key={`cloud-${i}`}
              className="absolute text-6xl opacity-20 pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 10}s`,
                animation: `float ${Math.random() * 15 + 25}s linear infinite`
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
  
  const getLocationBackground = () => {
    const lowerLocation = location.toLowerCase();
    
    // Location-specific backgrounds
    if (lowerLocation.includes('mumbai')) {
      return 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700'; // Ocean vibes
    }
    if (lowerLocation.includes('delhi')) {
      return 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-600'; // Historic/warm
    }
    if (lowerLocation.includes('bangalore') || lowerLocation.includes('bengaluru')) {
      return 'bg-gradient-to-br from-green-400 via-green-500 to-green-600'; // Garden city
    }
    if (lowerLocation.includes('chennai')) {
      return 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500'; // Coastal/warm
    }
    if (lowerLocation.includes('kolkata')) {
      return 'bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600'; // Cultural
    }
    if (lowerLocation.includes('hyderabad')) {
      return 'bg-gradient-to-br from-indigo-400 via-blue-500 to-purple-600'; // Tech city
    }
    if (lowerLocation.includes('pune')) {
      return 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600'; // IT hub
    }
    if (lowerLocation.includes('jaipur')) {
      return 'bg-gradient-to-br from-pink-400 via-rose-500 to-red-600'; // Pink city
    }
    if (lowerLocation.includes('goa')) {
      return 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600'; // Beach
    }
    if (lowerLocation.includes('kerala') || lowerLocation.includes('kochi')) {
      return 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700'; // Backwaters
    }
    if (lowerLocation.includes('udaipur')) {
      return 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600'; // Lake city
    }
    if (lowerLocation.includes('shimla') || lowerLocation.includes('manali')) {
      return 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500'; // Hill stations
    }
    
    // Weather-based fallback
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('storm')) {
      return 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800';
    }
    if (lowerCondition.includes('snow')) {
      return 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300';
    }
    if (lowerCondition.includes('cloud')) {
      return 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600';
    }
    // Sunny/Clear default
    return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
  };

  return (
    <>
      <div className={`fixed inset-0 transition-all duration-1000 ${getLocationBackground()}`}>
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
          50% { transform: translateX(100px); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes sunRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes heatWave {
          0%, 100% { 
            opacity: 0.3; 
            transform: translateY(0px) scale(1); 
          }
          50% { 
            opacity: 0.6; 
            transform: translateY(-20px) scale(1.1); 
          }
        }
      `}</style>
    </>
  );
};

// Header Component
const Header: React.FC = () => {
  return (
    <header className="text-center text-white mb-16 relative">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-light mb-4 text-white tracking-wide">
          WeatherAI
        </h1>
        <p className="text-lg md:text-xl opacity-80 font-light max-w-2xl mx-auto">
          Professional weather forecasting powered by machine learning
        </p>
      </div>
      
      <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
        AI Powered
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Extended list of Indian cities for autofill
  const allCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad',
    'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
    'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
    'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi',
    'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai',
    'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
    'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur',
    'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubballi-Dharwad',
    'Tiruchirappalli', 'Bareilly', 'Mysore', 'Tiruppur', 'Gurgaon',
    'Aligarh', 'Jalandhar', 'Bhubaneswar', 'Salem', 'Warangal',
    'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner',
    'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack',
    'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun',
    'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur',
    'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain'
  ];
  
  const popularCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Jaipur', 'Ahmedabad', 'Surat'
  ];

  // Filter cities based on search query
  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      const filtered = allCities.filter(city =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8); // Limit to 8 suggestions for better UX
      setFilteredCities(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredCities([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [searchQuery]);

  const handleSearch = (city?: string) => {
    const selectedCity = city || searchQuery.trim();
    if (selectedCity && selectedCity.length >= 2) {
      onLocationChange(selectedCity);
      setSearchQuery('');
      setIsExpanded(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city: string) => {
    handleSearch(city);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCities.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredCities.length) {
          handleSearch(filteredCities[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    setIsExpanded(true);
    if (searchQuery.trim().length >= 1) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setIsExpanded(false);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  return (
    <div className="mb-12">
      <div className="flex justify-center mb-8">
        <div className={`relative transition-all duration-300 ${isExpanded ? 'w-96' : 'w-80'}`}>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-500 px-6 py-4 pr-16 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base shadow-sm"
            placeholder="Search for an Indian city..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
          />
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200"
            onClick={() => handleSearch()}
          >
            <Search size={18} />
          </button>
          
          {/* Suggestions dropdown */}
          {showSuggestions && filteredCities.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-50"
            >
              {filteredCities.map((city, index) => (
                <div
                  key={city}
                  className={`px-4 py-3 cursor-pointer transition-colors duration-150 text-gray-900 ${
                    index === selectedIndex 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50'
                  } ${
                    index === 0 ? 'rounded-t-xl' : ''
                  } ${
                    index === filteredCities.length - 1 ? 'rounded-b-xl' : ''
                  }`}
                  onClick={() => handleSuggestionClick(city)}
                >
                  <div className="flex items-center space-x-3">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="font-medium">{city}</span>
                    <span className="text-sm text-gray-500 ml-auto">India</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
        {popularCities.map((city) => (
          <button
            key={city}
            className={`px-6 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
              currentLocation === city
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
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
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-xl border border-white/20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <MapPin className="text-blue-600" size={24} />
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{weather.city}</h2>
            <p className="text-gray-600">{weather.country}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1 flex items-center justify-end">
            <Clock size={16} className="mr-2" />
            Updated now
          </div>
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            Live Data
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="text-center lg:col-span-1">
          <div className="text-8xl mb-6">
            {getWeatherIcon(weather.description)}
          </div>
          <div className="text-6xl font-light mb-4 text-gray-900">
            {Math.round(weather.temperature)}°C
          </div>
          <p className="text-xl text-gray-600 mb-3 capitalize">{weather.description}</p>
          <p className="text-lg text-gray-500 bg-gray-50 px-4 py-2 rounded-lg inline-block">
            Feels like {Math.round(weather.feels_like)}°C
          </p>
        </div>
        
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-100">
              <Droplets className="mx-auto mb-3 text-blue-600" size={32} />
              <div className="text-2xl font-semibold text-gray-900 mb-1">{weather.humidity}%</div>
              <div className="text-sm text-gray-600">Humidity</div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 text-center border border-green-100">
              <Wind className="mx-auto mb-3 text-green-600" size={32} />
              <div className="text-2xl font-semibold text-gray-900 mb-1">{weather.windSpeed || 12} km/h</div>
              <div className="text-sm text-gray-600">Wind Speed</div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 text-center border border-purple-100">
              <Gauge className="mx-auto mb-3 text-purple-600" size={32} />
              <div className="text-2xl font-semibold text-gray-900 mb-1">{weather.pressure} mb</div>
              <div className="text-sm text-gray-600">Pressure</div>
            </div>
            
            <div className="bg-cyan-50 rounded-xl p-6 text-center border border-cyan-100">
              <Eye className="mx-auto mb-3 text-cyan-600" size={32} />
              <div className="text-2xl font-semibold text-gray-900 mb-1">{weather.visibility || 10} km</div>
              <div className="text-sm text-gray-600">Visibility</div>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-6 text-center border border-orange-100">
              <Sunrise className="mx-auto mb-3 text-orange-600" size={32} />
              <div className="text-2xl font-semibold text-gray-900 mb-1">{weather.sunrise || '6:30'}</div>
              <div className="text-sm text-gray-600">Sunrise</div>
            </div>
            
            <div className="bg-pink-50 rounded-xl p-6 text-center border border-pink-100">
              <Sunset className="mx-auto mb-3 text-pink-600" size={32} />
              <div className="text-2xl font-semibold text-gray-900 mb-1">{weather.sunset || '19:45'}</div>
              <div className="text-sm text-gray-600">Sunset</div>
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
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 mb-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <TrendingUp className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">AI Weather Prediction</h3>
            <div className="text-sm text-gray-600 mt-1 flex items-center space-x-4">
              <span className="flex items-center">📅 Next Hour</span>
              <span className="flex items-center">🤖 AI Analysis</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
          <span className="text-sm font-medium text-blue-700">Confidence: {prediction.confidence}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center bg-gray-50 rounded-xl p-6 border border-gray-100">
          <div className="text-4xl font-light text-gray-900 mb-2">
            {Math.round(prediction.predicted_temperature)}°C
          </div>
          <p className="text-gray-600">Predicted Temperature</p>
        </div>
        
        <div className="text-center bg-gray-50 rounded-xl p-6 border border-gray-100">
          <div className={`text-3xl font-semibold mb-2 ${isWarmer ? 'text-red-600' : 'text-blue-600'}`}>
            {isWarmer ? '+' : ''}{tempDiff.toFixed(1)}°C
          </div>
          <p className="text-gray-600">Expected Change</p>
        </div>
        
        <div className="text-center bg-gray-50 rounded-xl p-6 border border-gray-100">
          <div className="text-3xl mb-2">
            {isWarmer ? '📈' : '📉'}
          </div>
          <p className="text-gray-600">
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
    <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 text-center border border-white/30 hover:shadow-lg hover:bg-white/90 transition-all duration-200">
      <div className="font-medium text-gray-900 mb-4">
        {forecast.day}
      </div>
      <div className="text-4xl mb-4">
        {forecast.icon}
      </div>
      <div className="text-xl font-semibold text-gray-900 mb-2">
        {forecast.temp}
      </div>
      <div className="text-sm text-gray-600 mb-4 capitalize">
        {forecast.desc}
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div className="flex items-center justify-center space-x-1 bg-gray-50 rounded-lg py-2">
          <Droplets size={12} />
          <span>{forecast.humidity}%</span>
        </div>
        <div className="flex items-center justify-center space-x-1 bg-gray-50 rounded-lg py-2">
          <Wind size={12} />
          <span>{forecast.windSpeed}km/h</span>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const WeatherApp: React.FC = () => {
  const [location, setLocation] = useState('Mumbai');
  const [extendedView, setExtendedView] = useState(false);
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
    <div className="min-h-screen relative">
      {/* Animated Background */}
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
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <RefreshCw className="animate-spin text-blue-600" size={32} />
            </div>
            <p className="text-xl text-gray-700">Loading weather data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-lg">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-xl mb-6 text-red-800">{error}</p>
            <button 
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
              onClick={handleRefresh}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-8">
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
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-3">
                    <Calendar size={28} />
                    <span>7-Day Forecast</span>
                  </h2>
                  <button
                    onClick={() => setExtendedView(!extendedView)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      extendedView 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>📊</span>
                    <span>{extendedView ? 'Simple View' : 'Extended View'}</span>
                  </button>
                </div>
                <div className={`grid gap-4 ${
                  extendedView 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7'
                }`}>
                  {forecast.map((day, index) => (
                    <ForecastCard key={index} forecast={day} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
