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
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
interface DailyCardProps {
    day: {
        time: string;
        precipitationProbability: number;
        minTemp: number;
        maxTemp: number;
        weatherCode: number;
    };
}

const DailyCard = ({ day }: DailyCardProps) => {
    const { time, precipitationProbability, minTemp, maxTemp, weatherCode } =
        day;
    const dayName = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    const minRound = Math.round(minTemp);
    const maxRound = Math.round(maxTemp);
    const weatherIcon = getWeatherImageUrl(weatherCode);
    const date = new Date(time);
    date.setHours(24);
    const localDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
    );
    const formattedDate = localDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const dayOfWeek = new Date(formattedDate).getDay();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{dayName[dayOfWeek]}</CardTitle>
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
                        <p className="text-lg">
                            {minRound}°C - {maxRound}°C
                        </p>
                    </div>
                    <div className="flex flex-row gap-2">
                        <ThunderstormIcon />
                        <p className="text-lg">{precipitationProbability}%</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    );
};

export default DailyCard;
