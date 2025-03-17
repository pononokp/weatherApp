import { useState, useEffect } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
    const [weather, setWeather] = useState({});

    useEffect(() => {
        getWeather();
    }, []);

    function getWeather() {
        const params = { latitude: 45.9454, longitude: -66.6656 };
        axios
            .get('/server/weather', { params })
            .then((response) => {
                setWeather(response.data);
                console.log(response);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <>
            <div>
                <a
                    href="https://vite.dev"
                    target="_blank"
                >
                    <img
                        src={viteLogo}
                        className="logo"
                        alt="Vite logo"
                    />
                </a>
                <a
                    href="https://react.dev"
                    target="_blank"
                >
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div>
                <p>{JSON.stringify(weather)}</p>
            </div>
        </>
    );
}

export default App;
