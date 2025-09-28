import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ChatPage from './components/ChatPage';
import ProposalsPage from './components/ProposalsPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1',
      light: '#8B5FFF',
      dark: '#4F46E5',
    },
    secondary: {
      main: '#EC4899',
      light: '#F472B6',
      dark: '#DB2777',
    },
    background: {
      default: '#0F0F23',
      paper: '#1A1B3A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A1A1AA',
    },
    info: {
      main: '#06B6D4',
      light: '#67E8F9',
      dark: '#0891B2',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '12px 32px',
          boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.25)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.35)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
        },
      },
    },
  },
});

function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: '5a1851b1-3cee-4c78-8e34-5ad8853d59af',
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/proposals" element={<ProposalsPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </DynamicContextProvider>
  );
}

export default App;
