import React, { useState, useEffect, useRef } from 'react';

interface LocationSearchProps {
  onLocationChange: (location: string) => void;
  currentLocation: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationChange, currentLocation }) => {
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
    'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain',
    'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu',
    'Sangli-Miraj & Kupwad', 'Mangalore', 'Erode', 'Belgaum', 'Ambattur',
    'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon', 'Udaipur',
    'Maheshtala', 'Davanagere', 'Kozhikode', 'Kurnool', 'Rajpur Sonarpur',
    'Rajahmundry', 'Bokaro', 'South Dumdum', 'Bellary', 'Patiala',
    'Gopalpur', 'Agartala', 'Bhagalpur', 'Muzaffarnagar', 'Bhatpara',
    'Panihati', 'Latur', 'Dhule', 'Rohtak', 'Korba',
    'Bhilwara', 'Berhampur', 'Muzaffarpur', 'Ahmednagar', 'Mathura',
    'Kollam', 'Avadi', 'Kadapa', 'Kamarhati', 'Sambalpur',
    'Bilaspur', 'Shahjahanpur', 'Satara', 'Bijapur', 'Rampur',
    'Shivamogga', 'Chandrapur', 'Junagadh', 'Thrissur', 'Alwar',
    'Bardhaman', 'Kulti', 'Kakinada', 'Nizamabad', 'Parbhani',
    'Tumkur', 'Khammam', 'Ozhukarai', 'Bihar Sharif', 'Panipat',
    'Darbhanga', 'Bally', 'Aizawl', 'Dewas', 'Ichalkaranji'
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
    <div className="mb-8">
      <div className="flex justify-center mb-6">
        <div className={`relative transition-all duration-300 ${isExpanded ? 'w-80' : 'w-60'}`}>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-white bg-opacity-10 backdrop-blur-lg border-2 border-white border-opacity-30 text-white placeholder-white placeholder-opacity-70 px-6 py-4 pr-16 rounded-full focus:outline-none focus:border-opacity-60 focus:bg-opacity-20 transition-all duration-300"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
          />
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            onClick={() => handleSearch()}
          >
            🔍
          </button>
          
          {/* Suggestions dropdown */}
          {showSuggestions && filteredCities.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white border-opacity-50 max-h-64 overflow-y-auto z-50"
            >
              {filteredCities.map((city, index) => (
                <div
                  key={city}
                  className={`px-6 py-3 cursor-pointer transition-all duration-200 text-gray-800 ${
                    index === selectedIndex 
                      ? 'bg-blue-500 bg-opacity-20 text-blue-900' 
                      : 'hover:bg-gray-100 hover:bg-opacity-50'
                  } ${
                    index === 0 ? 'rounded-t-2xl' : ''
                  } ${
                    index === filteredCities.length - 1 ? 'rounded-b-2xl' : ''
                  }`}
                  onClick={() => handleSuggestionClick(city)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">📍</span>
                    <span className="font-medium">{city}</span>
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

export default LocationSearch;
