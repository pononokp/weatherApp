import axios from 'axios';

export async function searchPlaces(text: string) {
    const url = `https://nominatim.openstreetmap.org/search`;
    const params = {
        q: text, // The search query (location)
        format: 'json', // Response format
        addressdetails: 1, // Include detailed address information
    };

    try {
        const response = await axios.get(url, { params });
        return response.data; // Return the list of places found
    } catch (error) {
        console.error('Error fetching data:', error);
        return null; // Return null or handle the error accordingly
    }
}
