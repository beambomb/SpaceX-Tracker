# SpaceX Tracker 🚀

SpaceX Tracker is a web application designed to track and explore SpaceX launch missions. This project was built to consume third-party API data and present it through an interactive user interface.

## Function and Features

The primary function of this application is to allow users to view a list of SpaceX launches. It includes the following interactive features:
- **Mission Listing**: Displays mission names, launch dates, mission patches, and short descriptions.
- **Status Filtering**: Users can filter missions based on their launch status (All, Success, Failed).
- **Search Functionality**: A search bar allows users to find specific missions by name.
- **External Links**: Provides direct links to mission webcasts when available.

## Data Source

All launch data is fetched from the open-source **SpaceX API (v4)**: `https://api.spacexdata.com/v4/launches`. 

*Note: The data from this open-source API stopped receiving active updates from its community around late 2022. Missions from that period onwards may have `null` success values, which are intentionally handled and displayed as "Pending" within the application.*

## Tech Stack and Implementation

This project is built using the following technologies:

- **React**: Used as the core library for building the user interface. It manages data fetching, user inputs, and conditional rendering through hooks (`useState`, `useEffect`).
- **Vite**: Used as the build tool and development server for rapid compilation and hot module replacement.
- **Tailwind CSS v4**: Used for styling the application. The design implements a dark mode aesthetic with glassmorphism techniques (backdrop-blur, semi-transparent backgrounds).
- **Lucide React**: Used for the iconography across the user interface.
- **Custom CSS**: Pure CSS keyframes are utilized in `index.css` to create a continuous, multi-layered parallax scrolling effect for the starfield background.

## How It Works

1. **Initialization**: The application is initialized via Vite with a React template.
2. **Data Fetching**: Upon mounting, the `App` component executes an asynchronous `fetch` request to the SpaceX API. The data is sorted descendingly by date before being stored in the component's state.
3. **State Management**: The application maintains states for the launch data, loading status, search queries, and active filters. The search and filter logics compute a derived state (`filteredLaunches`) to determine what to render.
4. **Rendering**: The UI dynamically updates to render a grid of mission cards based on the active criteria. CSS animations running in the background create a right-to-left starfield movement that interacts dynamically with browser scrolling.

## Running Locally

To run this project on your local machine:

```bash
npm install
npm run dev
```
