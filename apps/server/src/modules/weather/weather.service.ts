import { fetchWeatherApi } from 'openmeteo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WeatherService {
    async getWeather(
        coordinates: { latitude: number; longitude: number },
        startDate: string,
        endDate: string
    ) {
        const { latitude, longitude } = coordinates;
        let params = {};
        if (!startDate || !endDate) {
            params = {
                latitude,
                longitude,
                daily: [
                    'weather_code',
                    'temperature_2m_max',
                    'temperature_2m_min',
                    'precipitation_probability_max',
                ],
                current: [
                    'temperature_2m',
                    'relative_humidity_2m',
                    'is_day',
                    'weather_code',
                    'wind_speed_10m',
                    'precipitation',
                    'apparent_temperature',
                ],
                timezone: 'auto',
            };
        } else {
            params = {
                latitude,
                longitude,
                daily: [
                    'weather_code',
                    'temperature_2m_max',
                    'temperature_2m_min',
                    'precipitation_probability_max',
                ],
                current: [
                    'temperature_2m',
                    'relative_humidity_2m',
                    'is_day',
                    'weather_code',
                    'wind_speed_10m',
                    'precipitation',
                    'apparent_temperature',
                ],
                timezone: 'auto',
                start_date: startDate,
                end_date: endDate,
            };
        }
        const url = 'https://api.open-meteo.com/v1/forecast';
        const responses = await fetchWeatherApi(url, params);

        const range = (start: number, stop: number, step: number) =>
            Array.from(
                { length: (stop - start) / step },
                (_, i) => start + i * step
            );

        // Process first location. Add a for-loop for multiple locations or weather models
        const response = responses[0];

        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();

        const current = response.current()!;
        const daily = response.daily()!;

        const weatherData = {
            current: {
                time: new Date(
                    (Number(current.time()) + utcOffsetSeconds) * 1000
                ),
                temperature2m: current.variables(0)!.value(),
                relativeHumidity2m: current.variables(1)!.value(),
                isDay: current.variables(2)!.value(),
                weatherCode: current.variables(3)!.value(),
                windSpeed10m: current.variables(4)!.value(),
                precipitation: current.variables(5)!.value(),
                apparentTemperature: current.variables(6)!.value(),
            },
            daily: {
                time: range(
                    Number(daily.time()),
                    Number(daily.timeEnd()),
                    daily.interval()
                ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),

                // Directly convert to arrays
                weatherCode: Object.values(
                    daily.variables(0)!.valuesArray() || {}
                ),
                temperature2mMax: Object.values(
                    daily.variables(1)!.valuesArray() || {}
                ),
                temperature2mMin: Object.values(
                    daily.variables(2)!.valuesArray() || {}
                ),
                precipitationProbabilityMax: Object.values(
                    daily.variables(3)!.valuesArray() || {}
                ),
            },
        };

        return weatherData;
    }

    async getHistoricalWeather() {}
}
