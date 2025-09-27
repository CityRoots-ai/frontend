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
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.12)'
        }}
      >
        <Toolbar>
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

      <Container maxWidth={false} sx={{ flex: 1, p: 0, height: 'calc(100vh - 64px)' }}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          <Box
            sx={{
              width: showChat ? '40%' : '100%',
              height: '100%',
              transition: 'width 0.3s ease-in-out',
            }}
          >
            <Paper
              elevation={3}
              sx={{
                height: '100%',
                borderRadius: 0,
                display: 'flex',
                flexDirection: 'column',
                background: '#FAFAFA'
              }}
            >
              <MapComponent
                parkData={parkData}
                selectedParkId={selectedParkId}
                onParkSelect={setSelectedParkId}
              />
            </Paper>
          </Box>

          {showChat && (
            <Box
              sx={{
                width: '60%',
                height: '100%',
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  height: '100%',
                  borderRadius: 0,
                  borderLeft: '1px solid #E0E0E0'
                }}
              >
                <ChatInterface
                  onParkDataUpdate={handleParkDataUpdate}
                  selectedParkId={selectedParkId}
                />
              </Paper>
            </Box>
          )}
        </Box>
      </Container>

      <Fab
        color="primary"
        onClick={() => setShowChat(!showChat)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1B5E20 0%, #388E3C 100%)',
          }
        }}
      >
        <ChatIcon />
      </Fab>
    </Box>
  );
};

export default MainLayout;