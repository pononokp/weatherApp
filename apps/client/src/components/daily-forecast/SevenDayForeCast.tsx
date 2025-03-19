import DailyCard from './DailyCard';

interface SevenDayForeCastProps {
    days: {
        time: string;
        precipitationProbability: number;
        minTemp: number;
        maxTemp: number;
        weatherCode: number;
    }[];
}

const SevenDayForeCast = ({ days }: SevenDayForeCastProps) => {
    return (
        <div className="flex flex-row gap-3 flex-wrap">
            {days.map((day) => (
                <DailyCard
                    key={day.time}
                    day={day}
                />
            ))}
        </div>
    );
};

export default SevenDayForeCast;
