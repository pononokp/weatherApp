import { useState, useEffect } from 'react';
import axios from 'axios';
import SingleRecord from './SingleRecord';
import { WeatherData } from './types/weatherInterface';

interface WeatherRecord {
    id: string;
    data: WeatherData;
}
interface AllRecordsProps {
    setWeatherData: (weatherData: WeatherData) => void;
    setCurrentId: (id: string) => void;
    forceUpdate: boolean;
    clearSelection: () => void;
}
const AllRecords = ({
    setWeatherData,
    setCurrentId,
    forceUpdate,
    clearSelection,
}: AllRecordsProps) => {
    const [allRecords, setAllRecords] = useState<WeatherRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [change, setChange] = useState(false);

    useEffect(() => {
        fetchWeatherData();
    }, [change, forceUpdate]);

    function fetchWeatherData() {
        const collection = 'weatherRecords';
        axios
            .get('/server/firebase/getData', { params: { collection } })
            .then((response) => {
                console.log(response.data.result);
                setAllRecords(response.data.result);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Failed to fetch weather data', error);
                setLoading(false);
            });
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {allRecords.map((record, index) => (
                <SingleRecord
                    key={index}
                    documentId={record.id}
                    weatherData={record.data}
                    setWeatherData={setWeatherData}
                    setChange={setChange}
                    change={change}
                    setCurrentId={setCurrentId}
                    clearSelection={clearSelection}
                />
            ))}
        </div>
    );
};

export default AllRecords;
