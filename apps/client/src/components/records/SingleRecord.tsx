import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaceIcon from '@mui/icons-material/Place';
import axios from 'axios';
import { WeatherData } from './types/weatherInterface';

// Interface for single records
interface SingleRecordProps {
    documentId: string;
    weatherData: WeatherData;
    setWeatherData: (weatherData: WeatherData) => void;
    setChange: (change: boolean) => void;
    change: boolean;
    setCurrentId: (id: string) => void;
    clearSelection: () => void;
}

const SingleRecord = ({
    documentId,
    weatherData,
    setWeatherData,
    setChange,
    change,
    setCurrentId,
    clearSelection,
}: SingleRecordProps) => {
    // Format Date to the correct day
    const startDate = new Date(weatherData.startDate);
    startDate.setHours(24);
    const localDate = new Date(
        startDate.getTime() + startDate.getTimezoneOffset() * 60000
    );
    const formattedStartDate = localDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Format Date to the correct day
    const endDate = new Date(weatherData.endDate);
    endDate.setHours(24);
    const localEndDate = new Date(
        endDate.getTime() + endDate.getTimezoneOffset() * 60000
    );
    const formattedEndDate = localEndDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    function handleDelete() {
        const collection = 'weatherRecords';
        const params = {
            collection: collection,
            uniqueId: documentId,
        };
        axios
            .delete('/server/firebase/deleteData', { params })
            .then((response) => {
                console.log(response);
                setChange(!change);
                clearSelection();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div
            className="flex flex-col items-center w-full cursor-pointer hover:bg-gray-300 border-2 border-gray-900"
            onClick={() => {
                setWeatherData(weatherData);
                setCurrentId(documentId);
            }}
        >
            <div className="flex flex-row gap-2">
                <PlaceIcon />
                <p className="text-lg">{weatherData.location}</p>
                <p className="text-lg">
                    {formattedStartDate}-{formattedEndDate}
                </p>
                <IconButton onClick={handleDelete}>
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    );
};

export default SingleRecord;
