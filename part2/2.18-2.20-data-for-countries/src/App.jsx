import { useState, useEffect } from 'react';

import axios from "axios";

import "./index.css";
import Countries from './components/Countries';
import Country from './components/Country';

const api_key = import.meta.env.VITE_YOUR_API_KEY;


const App = () => {
  const [searchCountry, setSearchCountry] = useState("");
  const [countries, setCountries] = useState(null);
  const [country, setCountry] = useState(null);
  const [searchFeedback, setSearchFeedback] = useState(null);
  

  const extractCountryInfo = country => {
    const name = country.name.common;
    const [capital] = country.capital;
    const area = country.area;
    const languages = Object.values(country.languages);
    const flag = country.flags.png;
    const [lat, lng] = country.latlng;

    return { name, capital, area, languages, flag, lat, lng };
  }

  const extractCountryCapitalWeather = weatherData => {
    const temp = weatherData.main.temp;
    const icon = weatherData.weather[0].icon;
    const wind = weatherData.wind.speed;

    return { temp, icon, wind };
  }

  useEffect(() => {

    if(searchCountry) {
      console.log("searching...");
      axios
        .get("https://studies.cs.helsinki.fi/restcountries/api/all")
        .then(response => {
          let countriesReceived = response.data.filter(c => {
            if(c.name.common.toLowerCase().includes(searchCountry.toLowerCase())) {
              return c;
            } 
            return false;
          });
          

          if(countriesReceived.length > 10) {
            setCountries(null);
            setCountry(null);
            setSearchFeedback("Too many matches, specify another filter");
          } else if(countriesReceived.length === 1) {
            setCountries(null);
            setSearchFeedback(null);
            const countryInfo = extractCountryInfo(countriesReceived[0]);
            axios
              .get(`https://api.openweathermap.org/data/2.5/weather?lat=${countryInfo.lat}&lon=${countryInfo.lng}&units=metric&appid=${api_key}`)
              .then(response => {
                const weatherInfo = extractCountryCapitalWeather(response.data);
                
                setCountry({ ...countryInfo, ...weatherInfo });
              })
          } else {
            setCountries(countriesReceived);
            setCountry(null);
            setSearchFeedback(null);
          }

        })
    }

  }, [searchCountry]);
  


  const handleChange = event => {
    setSearchCountry(event.target.value);
    // if value is empty set countries, country and feedback to null
    if(event.target.value === "") {
      setCountries(null);
      setCountry(null);
      setSearchFeedback(null);
    }
  }

  const handleShowCountry = (countryName, event) => {
    const foundCountry = countries.find(c => c.name.common === countryName);
    const countryInfo = extractCountryInfo(foundCountry);

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${countryInfo.lat}&lon=${countryInfo.lng}&units=metric&appid=${api_key}`)
      .then(response => {
        const weatherInfo = extractCountryCapitalWeather(response.data);
        
        setCountry({ ...countryInfo, ...weatherInfo });
      })
    
  }

  
  return (
    <div>
      find countries <input type="text" value={searchCountry} onChange={handleChange} />
      {searchFeedback && <p>{searchFeedback}</p>}
      <Countries countries={countries} onHandleShowCountry={handleShowCountry} />
      <Country country={country} />
    </div>
  )
}

export default App;
