import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {}

    @Get()
    async getWeather(
        @Query('latitude') latitude: number,
        @Query('longitude') longitude: number,
        @Query('start_date') startDate: string,
        @Query('end_date') endDate: string
    ) {
        if (!latitude || !longitude) {
            return {
                error: 'Latitude and longitude are required',
            };
        }
        return this.weatherService.getWeather(
            {
                latitude,
                longitude,
            },
            startDate,
            endDate
        );
    }
}
