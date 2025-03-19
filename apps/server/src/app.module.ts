import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './modules/weather/weather.module';
import { FirebaseModule } from './modules/firebase/firebase.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Ensures env variables are available globally
            envFilePath: process.env.NODE_ENV
                ? `.env.${process.env.NODE_ENV}`
                : '.env', // Load the correct .env file
        }),
        WeatherModule,
        FirebaseModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
