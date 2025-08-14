import React from 'react';

export interface PredictionResult {
  predicted_temperature: number;
  current_temperature: number;
  confidence: string;
  prediction_date?: string;
  prediction_time?: string;
}

const PredictionDisplay: React.FC<{ prediction: PredictionResult }> = ({ prediction }) => {
  const tempDiff = prediction.predicted_temperature - prediction.current_temperature;
  const isWarmer = tempDiff > 0;

  // Get current date and next hour for prediction - using India timezone
  const now = new Date();
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
  
  // Convert to India Standard Time (IST)
  const istOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata'
  };
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    };
    return date.toLocaleDateString('en-IN', options);
  };

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    };
    return date.toLocaleTimeString('en-IN', options);
  };

  const predictionDate = prediction.prediction_date || formatDate(nextHour);
  const predictionTime = prediction.prediction_time || formatTime(nextHour);
  const dayOfWeek = nextHour.toLocaleDateString('en-IN', { 
    weekday: 'long',
    timeZone: 'Asia/Kolkata'
  });

  return (
    <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-3xl p-8 text-white shadow-2xl hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">🤖</div>
          <div>
            <h3 className="text-2xl font-bold">AI Weather Prediction</h3>
            <div className="text-sm opacity-90 mt-1">
              <span className="mr-4">📅 {dayOfWeek}</span>
              <span>🕐 {predictionTime}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
          <span className="text-sm font-medium">Confidence: {prediction.confidence}</span>
        </div>
      </div>
      
      <div className="bg-white bg-opacity-10 rounded-2xl p-4 mb-6 text-center">
        <div className="text-sm opacity-80 mb-2">Predicting for</div>
        <div className="text-lg font-semibold">{predictionDate}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2 animate-pulse">
            {Math.round(prediction.predicted_temperature)}°C
          </div>
          <p className="text-lg opacity-90">Next Hour Prediction</p>
        </div>
        <div className="text-center">
          <div className={`text-3xl font-bold mb-2 ${isWarmer ? 'text-red-300' : 'text-blue-300'}`}>{isWarmer ? '+' : ''}{tempDiff.toFixed(1)}°C</div>
          <p className="text-lg opacity-90">Expected Change</p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">{isWarmer ? '📈' : '📉'}</div>
          <p className="text-lg opacity-90">{isWarmer ? 'Getting Warmer' : 'Getting Cooler'}</p>
        </div>
      </div>
    </div>
  );
};

export default PredictionDisplay;
