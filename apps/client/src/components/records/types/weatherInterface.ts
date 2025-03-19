// Interface for the weather data
export interface WeatherData {
    location: string;
    startDate: string;
    endDate: string;
    latitude: string;
    longitude: string;
    weather: WeatherDetails;
}

// Interface for the weather details (current and daily weather data)
interface WeatherDetails {
    current: CurrentWeather;
    daily: DailyWeather;
}

// Interface for the current weather
interface CurrentWeather {
    apparentTemperature: number;
    isDay: number;
    precipitation: number;
    relativeHumidity2m: number;
    temperature2m: number;
    time: string;
    weatherCode: number;
    windSpeed10m: number;
}

// Interface for the daily weather data
interface DailyWeather {
    precipitationProbabilityMax: number[];
    temperature2mMax: number[];
    temperature2mMin: number[];
    time: string[];
    weatherCode: number[];
}
