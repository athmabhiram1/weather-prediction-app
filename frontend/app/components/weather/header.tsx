import React from 'react';

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

export default Header;
