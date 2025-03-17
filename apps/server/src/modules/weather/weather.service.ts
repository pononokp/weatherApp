import { fetchWeatherApi } from 'openmeteo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WeatherService {
    async getWeather(coordinates: { latitude: number; longitude: number }) {
        const { latitude, longitude } = coordinates;
        const params = {
            latitude,
            longitude,
            daily: [
                'weather_code',
                'temperature_2m_max',
                'temperature_2m_min',
                'precipitation_probability_max',
            ],
            hourly: [
                'temperature_2m',
                'relative_humidity_2m',
                'weather_code',
                'precipitation',
                'precipitation_probability',
            ],
            current: [
                'temperature_2m',
                'relative_humidity_2m',
                'is_day',
                'weather_code',
                'wind_speed_10m',
                'precipitation',
            ],
            timezone: 'auto',
        };
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
        const hourly = response.hourly()!;
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
            },
            daily: {
                time: range(
                    Number(daily.time()),
                    Number(daily.timeEnd()),
                    daily.interval()
                ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
                weatherCode: daily.variables(0)!.valuesArray()!,
                temperature2mMax: daily.variables(1)!.valuesArray()!,
                temperature2mMin: daily.variables(2)!.valuesArray()!,
                precipitationProbabilityMax: daily.variables(3)!.valuesArray()!,
            },
            hourlyPerDay: (() => {
                const hourlyData = {
                    time: range(
                        Number(hourly.time()),
                        Number(hourly.timeEnd()),
                        hourly.interval()
                    ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
                    temperature2m: hourly.variables(0)!.valuesArray()!,
                    relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
                    weatherCode: hourly.variables(2)!.valuesArray()!,
                    precipitation: hourly.variables(3)!.valuesArray()!,
                    precipitationProbability: hourly
                        .variables(4)!
                        .valuesArray()!,
                };

                const dailyData: Record<string, any[]> = {};

                hourlyData.time.forEach((date, index) => {
                    const day = date.toISOString().split('T')[0]; // YYYY-MM-DD format

                    if (!dailyData[day]) {
                        dailyData[day] = [];
                    }

                    dailyData[day].push({
                        time: date.toISOString(),
                        temperature: hourlyData.temperature2m[index],
                        humidity: hourlyData.relativeHumidity2m[index],
                        weatherCode: hourlyData.weatherCode[index],
                        precipitation: hourlyData.precipitation[index],
                        precipitationProbability:
                            hourlyData.precipitationProbability[index],
                    });
                });

                return dailyData;
            })(),
        };

        return weatherData;
    }
}
