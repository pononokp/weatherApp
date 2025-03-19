import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import getWeatherImageUrl from '@/util/getWeatherIcons';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

interface CurrentWeatherCardProps {
    current: {
        time: string;
        temperature2m: number;
        relativeHumidity2m: number;
        isDay: number;
        weatherCode: number;
        windSpeed10m: number;
        precipitation: number;
        apparentTemperature: number;
    };
}

const CurrentWeatherCard = ({ current }: CurrentWeatherCardProps) => {
    const {
        temperature2m,
        apparentTemperature,
        isDay,
        weatherCode,
        windSpeed10m,
        time,
    } = current;
    const tempRound = Math.round(temperature2m);
    const apparentTempRound = Math.round(apparentTemperature);
    const windSpeedRound = Math.round(windSpeed10m);
    const day = isDay === 1;
    const weatherIcon = getWeatherImageUrl(weatherCode, day);
    const date = new Date(time);
    const localDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
    );
    const formattedDate = localDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Current Weather {day ? <WbSunnyIcon /> : <BedtimeIcon />}
                </CardTitle>
                <CardDescription>{formattedDate}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center">
                    <img
                        src={weatherIcon}
                        alt="Weather Icon"
                    />
                    <div className="flex flex-row gap-2">
                        <ThermostatIcon />
                        <p className="text-lg">{tempRound}°C</p>
                        <p className="text-lg">
                            Feels like {apparentTempRound}°C
                        </p>
                    </div>
                    <div className="flex flex-row gap-2">
                        <AirIcon />
                        <p className="text-lg">{windSpeedRound} km/h</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    );
};

export default CurrentWeatherCard;
