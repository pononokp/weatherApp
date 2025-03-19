# Weather Application

A full-stack weather application that allows users to search for weather data, save records, and view historical and forecast weather information.

## Features

- Search weather data for any location
- Save weather records to Firebase
- View historical weather records
- Export weather data to JSON
- Responsive design with Tailwind CSS
- Real-time weather updates

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: NestJS + TypeScript
- **Database**: Firebase Firestore
- **UI Components**: Material-UI + Shadcn UI
- **Date Handling**: Day.js
- **API**: Open-Meteo API + Nominatim Location API

## Prerequisites

- Node.js (v14 or higher)
- pnpm
- Firebase account

## Installation

1. Clone the repository and install turbo in root directory:

    ```bash
    git clone https://github.com/your-username/weatherApp.git
    cd weatherApp
    pnpm install
    ```

2. Install dependencies for both client and server:

    ```bash
    # Install client dependencies
    cd apps/client
    pnpm install

    # Install server dependencies
    cd ../server
    pnpm install
    ```

3. Set up environment variables:

    - Create a `.env` file in the server directory with your Firebase credentials to use DB

4. Start the development servers:
    ```bash
    pnpm run dev
    ```

## Project Structure

```
weatherApp/
├── apps/
│   ├── client/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── util/
│   │   │   ├── api/
│   │   │   └── App.tsx
│   │   └── vite.config.ts
│   └── server/
│       ├── src/
│       │   ├── modules/
│       │   │   ├── weather/
│       │   │   └── firebase/
│       │   ├── app.module.ts
│       │   └── main.ts
│       └── tsconfig.json
└── package.json
```

## API Endpoints

- `GET /server/weather` - Fetch weather data for a location
- `POST /server/firebase/addData` - Save weather record
- `PUT /server/firebase/updateData` - Update weather record
- `DELETE /server/firebase/deleteData` - Delete weather record
- `GET /server/firebase/getData` - Retrieve all weather records

## Data Flow

1. User searches for a location using Nominatim API
2. Server makes API call to Open-Meteo (could have and probably should have done this in the client)
3. Weather data is displayed in real-time
4. User can save the data to Firebase
5. Saved records can be viewed, updated, or deleted
6. User can export weather data to JSON format

## Export Functionality

Users can export weather data to JSON format. The exported file includes:

- Location details
- Date range
- Weather data
- Geographical coordinates

## Error Handling

- Comprehensive error handling for API calls
- User-friendly error messages
- Graceful degradation for unavailable services

## Security

- Environment variables for sensitive data
- Input validation
- Secure API communication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a new Pull Request

## Contact

For any questions or issues, please contact [promiseono@gmail.com](mailto:your-email@example.com).
