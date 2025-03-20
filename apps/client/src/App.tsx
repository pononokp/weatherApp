import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import CurrentWeatherCard from './components/current_weather';
import SevenDayForeCast from './components/daily-forecast';
import SearchLocation from './components/search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { Button } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import AllRecords from './components/records';
import { WeatherData } from './components/records/types/weatherInterface';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

interface LocationAddress {
    city?: string;
    state?: string;
    country?: string;
    country_code?: string;
}

interface Location {
    place_id: string;
    lat: string;
    lon: string;
    display_name: string;
    address: LocationAddress;
    type: string;
    importance: number;
}
interface WeatherForecast {
    time: string;
    precipitationProbability: number;
    minTemp: number;
    maxTemp: number;
    weatherCode: number;
}
function App() {
    console.log('API URL:', import.meta.env.VITE_API_URL);

    const [forceUpdate, setForceUpdate] = useState(false);
    const [currentId, setCurrentId] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [location, setLocation] = useState('Fredericton, NB, Canada');
    const [place, setPlace] = useState({} as Location);
    const [weather, setWeather] = useState({});
    const [current, setCurrent] = useState({
        time: '',
        temperature2m: 0,
        relativeHumidity2m: 0,
        isDay: 0,
        weatherCode: 0,
        windSpeed10m: 0,
        precipitation: 0,
        apparentTemperature: 0,
    });
    const [daily, setDaily] = useState<WeatherForecast[]>([]);
    const [weatherData, setWeatherData] = useState({} as WeatherData);

    useEffect(() => {
        if (place.display_name) {
            setLocation(place.display_name);
        }
    }, [place]);

    useEffect(() => {
        if (currentId) {
            setLocation(weatherData.location);
            setLatitude(weatherData.latitude);
            setLongitude(weatherData.longitude);

            if (weatherData.startDate) {
                setStartDate(dayjs(weatherData.startDate));
            } else {
                setStartDate(null);
            }
            if (weatherData.endDate) {
                setEndDate(dayjs(weatherData.endDate));
            } else {
                setEndDate(null);
            }
            setWeather(weatherData.weather);
            setCurrent(weatherData.weather.current);
            const weatherForecast = weatherData.weather.daily.time.map(
                (date: string, index: number) => ({
                    time: date,
                    precipitationProbability:
                        weatherData.weather.daily.precipitationProbabilityMax[
                            index
                        ],
                    minTemp: weatherData.weather.daily.temperature2mMin[index],
                    maxTemp: weatherData.weather.daily.temperature2mMax[index],
                    weatherCode: weatherData.weather.daily.weatherCode[index],
                })
            );
            setDaily(weatherForecast);
        }
    }, [currentId]);

    function getWeather() {
        const params = {
            latitude: latitude ? Number(latitude) : 45.9454,
            longitude: longitude ? Number(longitude) : -66.6656,
            start_date: '',
            end_date: '',
        };
        if (startDate) {
            params.start_date = startDate.format('YYYY-MM-DD');
        }
        if (endDate) {
            params.end_date = endDate.format('YYYY-MM-DD');
        }
        if (startDate && endDate && startDate.isAfter(endDate)) {
            window.alert('Start date must be before end date');
            return;
        }
        if (place.lat && place.lon) {
            setLocation(place.display_name);
            params.latitude = Number(place.lat);
            params.longitude = Number(place.lon);
        }
        axios
            .get('/server/weather', { params })
            .then((response) => {
                console.log(response.data);
                setWeather(response.data);
                setCurrent(response.data.current);
                const weatherForecast = response.data.daily.time.map(
                    (date: string, index: number) => ({
                        time: date,
                        precipitationProbability:
                            response.data.daily.precipitationProbabilityMax[
                                index
                            ],
                        minTemp: response.data.daily.temperature2mMin[index],
                        maxTemp: response.data.daily.temperature2mMax[index],
                        weatherCode: response.data.daily.weatherCode[index],
                    })
                );
                setDaily(weatherForecast);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function saveOrUpdateWeather() {
        if (Object.keys(weather).length === 0) {
            window.alert('Please get weather first');
            return;
        }
        const collection = 'weatherRecords';
        const data = {
            location: location,
            startDate: startDate?.format('YYYY-MM-DD'),
            endDate: endDate?.format('YYYY-MM-DD'),
            latitude: place.lat,
            longitude: place.lon,
            weather: weather,
        };
        let params = {};
        if (currentId) {
            params = {
                collection,
                uniqueId: currentId,
            };
            axios
                .put('/server/firebase/updateData', data, { params })
                .then((response) => {
                    console.log(response);
                    setForceUpdate(!forceUpdate);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            params = {
                collection,
            };

            axios
                .post('/server/firebase/addData', data, { params })
                .then((response) => {
                    console.log(response);
                    setForceUpdate(!forceUpdate);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    function clearSelection() {
        setCurrentId('');
        setLatitude('');
        setLongitude('');
        setWeatherData({} as WeatherData);
        setStartDate(null as Dayjs | null);
        setEndDate(null as Dayjs | null);
        setLocation('Fredericton, NB, Canada');
        setPlace({} as Location);
        setWeather({});
        setCurrent({
            time: '',
            temperature2m: 0,
            relativeHumidity2m: 0,
            isDay: 0,
            weatherCode: 0,
            windSpeed10m: 0,
            precipitation: 0,
            apparentTemperature: 0,
        });
        setDaily([] as WeatherForecast[]);
    }

    function exportData() {
        const data = {
            location: location,
            startDate: startDate?.format('YYYY-MM-DD'),
            endDate: endDate?.format('YYYY-MM-DD'),
            latitude: latitude,
            longitude: longitude,
            weather: weather,
        };
        const jsonString = JSON.stringify(data, null, 4); // Pretty format with 2-space indentation
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element and trigger a download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'weatherData.json';
        document.body.appendChild(a);
        a.click(); // Trigger download
        document.body.removeChild(a);

        // Free up the URL object memory
        URL.revokeObjectURL(url);
    }

    return (
        <div className="flex flex-row gap-3 w-full h-auto min-h-screen fixed top-0 left-0 bg-white">
            <div className="flex flex-col items-center gap-4 max-w-[70%] min-w-[70%] rounded-lg border-2 bg-gray-200 mt-3 mb-3 ml-3">
                <div className="flex flex-row items-center justify-center">
                    <h1 className="text-2xl font-bold">
                        Promise Ononokpono. Weather App for PM Accelerator
                    </h1>
                    <Tooltip title="PMA supports professionals at all career stages, from entry-level to executive roles, helping them develop essential product management and leadership skills. The program offers job hunting support, AI product management training, leadership coaching, and resume reviews, with access to a vast alumni network and free training resources. For more details, visit the LinkedIn page: Product Manager Accelerator.">
                        <IconButton>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className="flex flex-row w-full pt-10 pb-10 h-16 bg-gray-800 items-center m-5 justify-center text-white z-0 gap-5 pl-2 pr-2">
                    <PlaceIcon />
                    <text className="max-w-[400px] min-w-[400px]">
                        {location}
                    </text>
                    <SearchLocation setPlace={setPlace} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="flex flex-row gap-2">
                            <DatePicker
                                className="text-white bg-white rounded-lg"
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                            />
                            <DatePicker
                                className="text-white bg-white rounded-lg"
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                            />
                        </div>
                    </LocalizationProvider>
                    <Button
                        variant="contained"
                        onClick={() => getWeather()}
                    >
                        Search
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => saveOrUpdateWeather()}
                    >
                        Save
                    </Button>
                </div>
                <div className="flex flex-col items-center gap-4 h-[750px] overflow-y-auto">
                    <CurrentWeatherCard current={current} />
                    <SevenDayForeCast days={daily} />
                </div>
            </div>
            <div className="flex-col items-center gap-4 h-[90vh] overflow-y-auto mb-10 rounded-lg border-2 bg-gray-200 mr-3 my-3 p-3 w-full">
                <AllRecords
                    setWeatherData={setWeatherData}
                    setCurrentId={setCurrentId}
                    forceUpdate={forceUpdate}
                    clearSelection={clearSelection}
                />
            </div>
            <div className="flex flex-row fixed bottom-5 right-10 gap-4 z-30">
                <Button
                    className="rounded-lg"
                    variant="contained"
                    onClick={() => exportData()}
                >
                    Export
                </Button>
                <Button
                    className="rounded-lg"
                    variant="contained"
                    onClick={() => clearSelection()}
                >
                    Clear Selection
                </Button>
            </div>
        </div>
    );
}

export default App;
