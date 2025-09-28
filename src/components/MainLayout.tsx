import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Fab,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import MapIcon from '@mui/icons-material/Map';
import ChatInterface from './ChatInterface';
import MapComponent from './MapComponent';

const MainLayout: React.FC = () => {
  const [showChat, setShowChat] = useState(true);
  const [parkData, setParkData] = useState(null);
  const [selectedParkId, setSelectedParkId] = useState<string | null>(null);

  const handleParkDataUpdate = (data: any) => {
    setParkData(data);
  };

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', m: 0, p: 0 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5FFF 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          width: '100%'
        }}
      >
        <Toolbar sx={{ width: '100%', m: 0, p: 2 }}>
          <MapIcon sx={{ mr: 2, fontSize: 28 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            CityRoots AI Assistant
          </Typography>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.9,
              fontWeight: 300
            }}
          >
            Urban Planning & Park Analysis
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, display: 'flex', height: 'calc(100vh - 64px)', width: '100%', m: 0, p: 0 }}>
        <Box
          sx={{
            width: showChat ? '50%' : '100%',
            height: '100%',
            transition: 'width 0.3s ease-in-out',
          }}
        >
          <MapComponent
            parkData={parkData}
            selectedParkId={selectedParkId}
            onParkSelect={setSelectedParkId}
          />
        </Box>

        {showChat && (
          <Box
            sx={{
              width: '50%',
              height: '100%',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <ChatInterface
              onParkDataUpdate={handleParkDataUpdate}
              selectedParkId={selectedParkId}
            />
          </Box>
        )}
      </Box>

      <Fab
        onClick={() => setShowChat(!showChat)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: 56,
          height: 56,
          bgcolor: '#6366F1',
          color: 'white',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
          '&:hover': {
            bgcolor: '#4F46E5',
            transform: 'scale(1.1)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
          },
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <ChatIcon />
      </Fab>
    </Box>
  );
};

export default MainLayout;