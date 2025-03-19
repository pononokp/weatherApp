import { useState } from 'react';
import { searchPlaces } from '../../api';
import SearchIcon from '@mui/icons-material/Search';

interface LocationAddress {
    city?: string;
    state?: string;
    country?: string;
    country_code?: string;
}

interface Location {
    place_id: string;
    lat: string;
    lon: string;
    display_name: string;
    address: LocationAddress;
    type: string;
    importance: number;
}

interface SearchLocationProps {
    setPlace: (place: Location) => void;
}

const SearchLocation = ({ setPlace }: SearchLocationProps) => {
    const [text, setText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [openSearchResults, setOpenSearchResults] = useState(false);

    async function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setText(e.target.value);
        const data = await searchPlaces(e.target.value);
        setSearchResults(data);
        setOpenSearchResults(data.length);
    }

    const changePlace = (place: Location) => {
        setPlace(place);
        setText('');
        setOpenSearchResults(false);
    };

    return (
        <div className="flex flex-col justify-center">
            <div className="flex flex-col">
                <div className="flex flex-row rounded-lg border">
                    <div className="">
                        <SearchIcon />
                    </div>
                    <div className="">
                        <input
                            type="text"
                            name="search-city"
                            placeholder="Search city ..."
                            value={text}
                            onChange={onSearch}
                        />
                    </div>
                </div>

                {openSearchResults && (
                    <div className="flex flex-col absolute top-30 justify-center z-10">
                        <div className="flex flex-col bg-gray-400 scroll-auto gap-1">
                            {searchResults.map((place: Location) => (
                                <div
                                    className="cursor-pointer hover:bg-gray-300"
                                    key={place.place_id}
                                    onClick={() => changePlace(place)}
                                >
                                    {place.display_name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchLocation;
