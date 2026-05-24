# SpaceX Tracker 🚀

SpaceX Tracker is a web application designed to track and explore SpaceX launch missions. This project was built to consume third-party API data and present it through an interactive user interface.

## Function and Features

The primary function of this application is to allow users to view a list of SpaceX launches. It includes the following interactive features:
- **Mission Listing**: Displays mission names, launch dates, mission patches, and short descriptions.
- **Interactive Timeline**: A horizontal timeline allows users to filter the entire dataset by specific launch years.
- **Status Filtering**: Users can filter missions based on their launch status (All, Success, Failed).
- **Search Functionality**: A search bar allows users to find specific missions by name.
- **Launch Map Integration**: Detailed mission views include an embedded interactive map that plots the exact coordinates of the specific launchpad.
- **Webcast Replay**: Detailed mission views embed the official YouTube webcast if available.

## Data Source

All data is fetched from the open-source **SpaceX API (v4)**:
- Launches: `https://api.spacexdata.com/v4/launches`
- Launchpads: `https://api.spacexdata.com/v4/launchpads`

*Note: The data from this open-source API stopped receiving active updates from its community around late 2022. Missions from that period onwards may have `null` success values, which are intentionally handled and displayed as "Pending" within the application.*

## Tech Stack and Implementation

This project is built using the following technologies:

- **React**: Used as the core library for building the user interface. It manages data fetching, user inputs, and conditional rendering through hooks (`useState`, `useEffect`).
- **Vite**: Used as the build tool and development server for rapid compilation and hot module replacement.
- **Tailwind CSS v4**: Used for styling the application. The design implements a dark mode aesthetic with glassmorphism techniques (backdrop-blur, semi-transparent backgrounds).
- **Leaflet & React-Leaflet**: Used to render the interactive map and plot launchpad coordinates dynamically based on API responses.
- **Lucide React**: Used for the iconography across the user interface.
- **Custom CSS**: Pure CSS keyframes are utilized in `index.css` to create a continuous, multi-layered parallax scrolling effect for the starfield background.

## How It Works

1. **Initialization**: The application is initialized via Vite with a React template.
2. **Data Fetching**: Upon mounting, the `App` component executes concurrent asynchronous `fetch` requests (via `Promise.all`) to the SpaceX launches and launchpads endpoints. The launchpad data is reduced into a dictionary map for O(1) time complexity lookups.
3. **State Management**: The application maintains states for the launch data, launchpads dictionary, loading status, search queries, active filters, and timeline selection. The search, filter, and timeline logics compute a derived state (`filteredLaunches`) to determine what to render.
4. **Rendering**: The UI dynamically updates to render a grid of mission cards based on the active criteria. Clicking a card opens a modal overlay displaying the mission details, YouTube embed, and a Leaflet map component centered on the respective launchpad's latitude and longitude.

## Running Locally

To run this project on your local machine:

```bash
npm install
npm run dev
```
