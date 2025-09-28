import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Fab,
  IconButton,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatInterface from './ChatInterface';
import MapComponent from './MapComponent';
import ProfileDropdown from './ProfileDropdown';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const ChatPage: React.FC = () => {
  const [showChat, setShowChat] = useState(true);
  const [parkData, setParkData] = useState(null);
  const [selectedParkId, setSelectedParkId] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleParkDataUpdate = (data: any) => {
    setParkData(data);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Floating Back Button */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={() => navigate('/dashboard')}
          sx={{
            bgcolor: 'rgba(99, 102, 241, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: 50,
            '&:hover': {
              bgcolor: 'rgba(99, 102, 241, 0.2)',
            },
          }}
        >
          <ArrowBackIcon sx={{ color: theme.palette.primary.main }} />
        </IconButton>
      </Box>

      {/* Floating User Profile */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <ProfileDropdown />
      </Box>

      <Container maxWidth={false} sx={{ flex: 1, p: 0, height: '100vh' }}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          <Box
            sx={{
              width: showChat ? '50%' : '100%',
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
                width: '50%',
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
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <ChatIcon />
      </Fab>
    </Box>
  );
};

export default ChatPage;