# CityRoots Frontend

A modern React TypeScript frontend for the CityRoots AI urban planning assistant. Features a ChatGPT-like interface with integrated interactive mapping for park visualization and analysis.

## Features

- 🤖 **ChatGPT-like Interface** - Intuitive chat interface for natural language queries
- 🗺️ **Interactive Maps** - Real-time park polygon rendering with Leaflet
- 🎨 **Material-UI Design** - Professional, responsive UI components
- 📱 **Responsive Layout** - Optimized for desktop and mobile devices
- 🔄 **Real-time Updates** - Live map updates based on chat interactions
- 🎯 **Park Selection** - Click-to-select parks with detailed information popups

## Prerequisites

- Node.js 16+
- npm or yarn
- Running CityRoots FastAPI backend

## Quick Start

### 1. Install Dependencies

```bash
cd cityroots-frontend
npm install
```

### 2. Environment Setup

The `.env` file is already configured with default values:

```env
REACT_APP_API_URL=http://localhost:4000
REACT_APP_MAP_DEFAULT_LAT=30.2672
REACT_APP_MAP_DEFAULT_LNG=-97.7431
REACT_APP_MAP_DEFAULT_ZOOM=11
```

### 3. Start Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

## Usage

### Chat Interface

- Type natural language queries like:
  - "Show parks in Austin"
  - "Show parks in zipcode 20008"
  - "What's the area of this park?"
  - "What happens if this park is removed?"

### Map Interaction

- **View Parks**: Parks appear as colored polygons on the map
- **Select Parks**: Click on any park polygon to select it
- **Park Details**: Selected parks show detailed information in popups
- **Zoom & Pan**: Use mouse/touch to navigate the map

### Interface Controls

- **Chat Toggle**: Floating action button to show/hide chat panel
- **Responsive Design**: Layout adapts automatically to screen size
- **Park Counter**: Live count of displayed parks
- **Selection Indicator**: Visual feedback for selected parks

## Project Structure

```
src/
├── components/
│   ├── MainLayout.tsx      # Main application layout
│   ├── ChatInterface.tsx   # Chat component with message handling
│   └── MapComponent.tsx    # Interactive map with park rendering
├── services/
│   └── api.ts             # Backend API integration
├── App.tsx                # Main app component with theme
└── index.css             # Global styles and map styling
```

## Key Components

### MainLayout
- Responsive grid layout with map and chat panels
- Floating action button for chat toggle
- Professional header with branding

### ChatInterface
- Message history with user/bot avatars
- Real-time typing and loading indicators
- Message data visualization (chips, metrics)
- Auto-scroll to latest messages

### MapComponent
- Leaflet integration with OpenStreetMap tiles
- Dynamic park polygon rendering
- Interactive park selection and popups
- Custom styling and hover effects

## Styling & Theme

- **Material-UI Theme**: Custom green/blue color palette
- **Professional Design**: Clean, modern interface
- **Responsive**: Mobile-first responsive design
- **Accessibility**: WCAG compliant color contrasts

## API Integration

The frontend communicates with the FastAPI backend through:

- `POST /api/agent` - Chat messages and responses
- `POST /api/analyze` - Environmental impact analysis
- `POST /api/ndvi` - NDVI calculations
- `GET /health` - Backend health checks

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:4000` |
| `REACT_APP_MAP_DEFAULT_LAT` | Default map latitude | `30.2672` |
| `REACT_APP_MAP_DEFAULT_LNG` | Default map longitude | `-97.7431` |
| `REACT_APP_MAP_DEFAULT_ZOOM` | Default map zoom level | `11` |

## Technologies

- **React 18** with TypeScript
- **Material-UI v6** for components and theming
- **Leaflet** for interactive mapping
- **Axios** for API communication
- **Create React App** for build tooling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License
