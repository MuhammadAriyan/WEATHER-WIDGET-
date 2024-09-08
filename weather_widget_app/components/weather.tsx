'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Input } from "@/components/ui/input";
import { SunIcon, CloudSunIcon, CloudIcon, CloudRainIcon, CloudSnowIcon, ZapIcon, CloudFog, SnowflakeIcon, LinkedinIcon, Heart, MapPinIcon, ThermometerIcon, Swords, LocateIcon } from "lucide-react";
import Link from 'next/link';

type typeOfWeather = {
  temperature: string;
  description: any;
  location: any;
  unit: "C";
  temperaturemsg?: string;
} | null;

const Weather = () => {


  let [error, setError] = useState<boolean>(false);
  let [country, setCountry] = useState<string>('');
  let [loading, setLoading] = useState(false);
  let [gotData, setGotData] = useState<boolean>(false);
  let [weatherDetails, setWeatherDetails] = useState<typeOfWeather>(null);
  let [Msgicon, setMsgicon] = useState<JSX.Element | null>(null);

  const apiKey = 'aeb45b1ccd3f4a1680f92912241008';

  async function getData(params: string) {
    try {
      setError(false);
      setLoading(true);
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${params.trim()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const weatherDetailsObj: typeOfWeather = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      weatherDetailsObj.temperaturemsg = getTemperatureMessage(weatherDetailsObj.temperature, weatherDetailsObj.unit);
      weatherDetailsObj.description = getWeatherMessage(weatherDetailsObj.description);
      setWeatherDetails(weatherDetailsObj);
      setLoading(false);
      setGotData(true);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setCountry('');
      setError(true);
      setWeatherDetails(null);
    }
  }

  function getWeatherMessage(description: string): string {
    switch (description.toLowerCase()) {
      case "sunny":
        setMsgicon(<SunIcon className="mr-2" />);
        return "It's a beautiful sunny day! Perfect for setting sail on the Grand Line.";
      case "partly cloudy":
        setMsgicon(<CloudSunIcon className="mr-2" />);
        return "Expect some clouds and sunshine. A day fit for a Straw Hat adventure!";
      case "cloudy":
        setMsgicon(<CloudIcon className="mr-2" />);
        return "It's cloudy today. The calm before the storm, perhaps?";
      case "overcast":
        setMsgicon(<CloudIcon className="mr-2" />);
        return "The sky is overcast. A mysterious day, just like the New World.";
      case "rain":
        setMsgicon(<CloudRainIcon className="mr-2" />);
        return "Don't forget your umbrella! The rain might remind you of a Water 7 downpour.";
      case "thunderstorm":
        setMsgicon(<ZapIcon className="mr-2" />);
        return "Thunderstorms are expected today. Just like a battle at sea with Enel's wrath!";
      case "snow":
        setMsgicon(<CloudSnowIcon className="mr-2" />);
        return "Bundle up! It's snowing, just like the winter islands on the Grand Line.";
      case "mist":
        setMsgicon(<CloudFog className="mr-2" />);
        return "It's misty outside. Feels like a day on Thriller Bark.";
      case "fog":
        setMsgicon(<CloudFog className="mr-2" />);
        return "Be careful, there's fog outside. Stay sharp, like you're navigating through Totto Land.";
      default:
        return description; // Default to returning the description as it is
    }
  }

  function getTemperatureMessage(temperature: string | number, unit: string): string {
    const formatTemperature = (temp: number) => `${temp}°${unit}`;
    if (typeof temperature === 'string') temperature = parseInt(temperature);
    if (unit === "C") {
      if (temperature < 0) {
        return `❄️ Brrr! It's freezing at ${formatTemperature(temperature)}. Time to cozy up!`;
      } else if (temperature < 10) {
        return `🧥 It's pretty chilly at ${formatTemperature(temperature)}. Don't forget your coat!`;
      } else if (temperature < 20) {
        return `🌤️ The weather's at ${formatTemperature(temperature)}. A light jacket should do the trick.`;
      } else if (temperature < 30) {
        return `😎 It's a beautiful ${formatTemperature(temperature)}. Perfect day to be outside!`;
      } else {
        return `🔥 It's sweltering at ${formatTemperature(temperature)}. Make sure to stay cool and hydrated!`;
      }
    } else {
      return `The temperature is ${formatTemperature(temperature)}. Stay informed and prepared!`;
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (country) {
        getData(country);
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [country]);

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-bg1 bg-no-repeat bg-cover bg-center">
        <Card className='w-full max-w-md mx-auto text-center rounded-lg shadow-lg backdrop-blur-sm' >
          <CardHeader>
            <CardTitle className='text-center'>WEATHER WIDGET APP</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="px-4 py-2"> {/* Added padding here */}
              <Input
                type="text"
                placeholder="SEARCH "
                onChange={(e) => setCountry((e.target.value).trim())} // Only set the country state here
              />
              {loading && (
                <div className='top-10 m-3 flex justify-center items-center'>
                  <div className="loader"></div>
                </div>
              )}
              {error && (
                <h1 className='text-red-500 opacity-75 top-10 m-5 hover:text-red-700 hover:opacity-100'>INVALID INPUT OR SOMETHING UNEXPECTED HAPPENED...</h1>
              )}
              {!loading && gotData && weatherDetails && (
                <div className="flex flex-col space-y-2 m-3">
                  <p className="flex items-center"><ThermometerIcon /> {weatherDetails.temperature}</p>
                  <div className="flex items-center "><LocateIcon /> <p className=' ml-1'>{weatherDetails.location}</p></div>
                  <div className="flex items-center"><div className='-mt-4'>{Msgicon}</div><p className=''>{weatherDetails.description}</p></div>
                  <p>{weatherDetails.temperaturemsg}</p>
                </div>
              )}

            </CardDescription>
          </CardContent>
          <CardFooter className="relative w-full">
            {/* Footer message on the left */}
            <div className="text-left text-sm font-medium">
              <h3 className="flex items-center space-x-2 -mb-3">
                MADE WITH  <Heart className=" ml-1 mr-1 text-red-500 hover:fill-red-500" size={16} /> BY MUHAMMAD ARYAN <Swords size={16} className='hover:text-orange-600 ease-in-out' />
              </h3>
            </div>
            <div className="absolute bottom-0 right-0 flex items-center space-x-2 p-2">
              <Link href={'https://github.com/MuhammadAriyan'}>
                <img src="github.png" alt="GITHUB" width={30} className="opacity-75 hover:opacity-100 transition duration-200 ease-in-out" />
              </Link>
              <Link href={'https://www.linkedin.com/in/muhammad-aryan'}>
                <LinkedinIcon className="opacity-75 hover:opacity-100 transition duration-200 ease-in-out" size={30} />
              </Link>
            </div>
          </CardFooter>

        </Card>
      </div>
    </>
  );
};

export default Weather;
