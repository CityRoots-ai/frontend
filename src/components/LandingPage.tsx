import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  useTheme,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  HowToVote as VoteIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useNavigate } from 'react-router-dom';
import WalletConnect from './WalletConnect';

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const { user } = useDynamicContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: <AIIcon sx={{ fontSize: 40 }} />,
      title: 'AI Assistant',
      description: 'Ask questions about parks and get instant insights.',
    },
    {
      icon: <VoteIcon sx={{ fontSize: 40 }} />,
      title: 'Community Proposals',
      description: 'Vote on urban planning changes in your area.',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Data Analytics',
      description: 'Access environmental data and community metrics.',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#1A1B3A',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.1s ease',
      }}
    >
      {/* Floating Geometric Shapes */}
      <motion.div
        style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: '150px',
          height: '150px',
          opacity: 0.1,
          pointerEvents: 'none',
          zIndex: 0,
        }}
        animate={{
          rotate: [0, 360],
          scale: [0.8, 1.1, 0.8],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `2px dashed ${theme.palette.primary.main}`,
            position: 'relative',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              border: `1px solid ${theme.palette.secondary.main}`,
              borderRadius: '50%',
            },
            '&::before': {
              top: '20%',
              left: '20%',
              right: '20%',
              bottom: '20%',
            },
            '&::after': {
              top: '35%',
              left: '35%',
              right: '35%',
              bottom: '35%',
            }
          }}
        />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          top: '60%',
          left: '5%',
          width: '100px',
          height: '100px',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0,
        }}
        animate={{
          rotate: [0, -360],
          y: [0, -20, 0],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            background: `conic-gradient(${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
            borderRadius: '20%',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
        />
      </motion.div>
      <Container maxWidth="lg" sx={{ textAlign: 'center', py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: 'white',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            CityRoots.ai
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              mb: 5,
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            Bridging the gap between urban planning and community needs
            with cutting-edge AI technology
          </Typography>

          <Box sx={{ mb: 6 }}>
            <WalletConnect
              sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.1s ease',
              }}
            >
              🚀 Launch into the Future
            </WalletConnect>
          </Box>
        </Box>

        {/* Features */}
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card
                sx={{
                  p: 4,
                  height: '100%',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  textAlign: 'center',
                  transition: 'all 0.1s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    color: theme.palette.primary.main,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'white',
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;