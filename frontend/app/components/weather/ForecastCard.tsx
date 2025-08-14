import React from 'react';

export interface ForecastDay {
  day: string;
  icon: string;
  temp: string;
  desc: string;
  condition: string;
  humidity: number;
  windSpeed: number;
}

const ForecastCard: React.FC<{ forecast: ForecastDay; index: number }> = ({ forecast, index }) => {
  return (
    <div 
      className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 text-center text-white border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="font-bold text-lg mb-3 opacity-90">{forecast.day}</div>
      <div className="text-5xl mb-4 hover:scale-110 transition-transform duration-300">{forecast.icon}</div>
      <div className="text-2xl font-bold mb-2">{forecast.temp}</div>
      <div className="text-sm opacity-80 mb-3">{forecast.desc}</div>
      <div className="grid grid-cols-2 gap-2 text-xs opacity-75">
        <div className="flex items-center justify-center space-x-1">
          <span>💧</span>
          <span>{forecast.humidity}%</span>
        </div>
        <div className="flex items-center justify-center space-x-1">
          <span>🌬️</span>
          <span>{forecast.windSpeed}km/h</span>
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;
