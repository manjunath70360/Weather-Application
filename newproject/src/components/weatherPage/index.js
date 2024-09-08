import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { WiHumidity } from "react-icons/wi";
import { LuWind } from "react-icons/lu";
import { LiaTemperatureHighSolid, LiaTemperatureLowSolid } from "react-icons/lia";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./index.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const apiKey = '35f28c859e9e19b9c301a2151dd554dc';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

const WeatherPage = () => {
  const { city } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    if (!city) {
      setError('City parameter is missing');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(weatherUrl, {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric'
        }
      });
      setWeatherData(response.data);
      setError('');
    } catch (err) {
      console.error('API request error:', err.response ? err.response.data : err.message);
      setError('Error fetching weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const getWeatherImage = (weather) => {
    switch (weather) {
      case 'Clouds': return 'https://res.cloudinary.com/dwwunc51b/image/upload/v1722767300/cloud_eijeb3.png';
      case 'Haze': return 'https://res.cloudinary.com/dwwunc51b/image/upload/v1722767300/cloud_eijeb3.png';
      case 'Drizzle': return 'https://res.cloudinary.com/dwwunc51b/image/upload/v1722767300/drizzle_maygnu.png';
      case 'Clear': return 'https://res.cloudinary.com/dwwunc51b/image/upload/v1722767300/sun_sscjae.png';
      default: return 'https://res.cloudinary.com/dwwunc51b/image/upload/v1722767300/drizzle_maygnu.png';
    }
  };

  const getBackgroundClass = (weather) => {
    switch (weather) {
      case 'Clouds': return 'cloudy';
      case 'Drizzle': return 'drizzle';
      case 'Clear': return 'clear';
      default: return 'drizzle';
    }
  };

  return (
    <div className={`app-container ${weatherData ? getBackgroundClass(weatherData.weather[0].main) : ''}`}>
      <h1 className="app-title">Weather Info</h1>
      
      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {weatherData && (
        <div className='weather-container'>
          <div className='weather-data-con'> 
            <img src={getWeatherImage(weatherData.weather[0].main)}
              alt={weatherData.weather[0].description}
              className="weather-image"
            />
            <div className="weather-info">
              <h2 className="weather-temperature">{Math.round(weatherData.main.temp)}°C</h2>
              <p className="weather-description">{weatherData.weather[0].description}</p>
              <p className="weather-location">
                {weatherData.name}, <strong>{weatherData.sys.country}</strong>
              </p>
              <div className='icons-con'>
                <div className='weather-icon-text'>
                  <WiHumidity className='icon'/>
                  <div className='weather-text-con'>
                    <p className="weather-details">{weatherData.main.humidity}%</p>
                    <p className='des'>Humidity</p>
                  </div>
                </div>
                <div className='weather-icon-text'>
                  <LuWind className='icon'/>
                  <div className='weather-text-con'>
                    <p className="weather-details">{weatherData.wind.speed} Km/h</p>
                    <p className='des'>Wind Speed</p>
                  </div>
                </div>
              </div>  
              <div className='icons-con'>
                <div className='weather-icon-text'>
                  <LiaTemperatureLowSolid className='icon'/>
                  <div className='weather-text-con'>
                    <p className="weather-details">{weatherData.main.temp_min}°C</p>
                    <p className='des'>Low Temperature</p>
                  </div>
                </div>
                <div className='weather-icon-text'>
                  <LiaTemperatureHighSolid className='icon'/>
                  <div className='weather-text-con'>
                    <p className="weather-details">{weatherData.main.temp_max}°C</p>
                    <p className='des'>High Temperature</p>
                  </div>
                </div>
              </div> 
            </div>
          </div>
     
         <div className='map-container'>
         {weatherData.coord && (
            <MapContainer
              center={[weatherData.coord.lat, weatherData.coord.lon]}
              zoom={10}
              style={{ height: "300px", width:"98%", marginTop: "20px", borderRadius:'10px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[weatherData.coord.lat, weatherData.coord.lon]}>
                <Popup>
                  {weatherData.name}, {weatherData.sys.country}
                </Popup>
              </Marker>
            </MapContainer>
          )}
          </div>
        </div>    
      )}
    </div>
  );
};

export default WeatherPage;
