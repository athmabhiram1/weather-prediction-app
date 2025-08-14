import React from 'react';

interface WeatherBackgroundProps {
  condition: string;
  location: string;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ condition }) => {
  // This component will be implemented to use real weather data
  return (
    <div className="fixed inset-0 transition-all duration-1000 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <div className="absolute inset-0 bg-black bg-opacity-20" />
    </div>
  );
};

export default WeatherBackground;
