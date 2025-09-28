import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  useTheme,
  Avatar,
} from '@mui/material';
import {
  Chat as ChatIcon,
  HowToVote as ProposalsIcon,
  AutoAwesome as AIIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import ProfileDropdown from './ProfileDropdown';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useDynamicContext();

  // Floating particles for dashboard
  const [particles] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 8,
    }))
  );

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);


  if (!user) {
    return null;
  }

  const handleChatAssistant = () => {
    navigate('/chat');
  };

  const handleProposals = () => {
    navigate('/proposals');
  };

  const dashboardOptions = [
    {
      title: 'AI Chat Assistant',
      description: 'Get instant AI-powered insights about parks, demographics, and environmental data in your area. Ask questions and receive intelligent analysis.',
      icon: <ChatIcon sx={{ fontSize: 48 }} />,
      action: handleChatAssistant,
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    },
    {
      title: 'Community Proposals',
      description: 'Participate in democratic decision-making for your neighborhood. View, discuss, and vote on urban planning proposals and initiatives.',
      icon: <ProposalsIcon sx={{ fontSize: 48 }} />,
      action: handleProposals,
      color: theme.palette.secondary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
    },
  ];


  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        position: 'relative',
      }}
    >
      {/* Dynamic Animated Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 50%, ${theme.palette.primary.main}08 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, ${theme.palette.secondary.main}08 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, ${theme.palette.info.main}04 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />

      {/* Floating Particles */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}50, ${theme.palette.secondary.main}50)`,
              filter: 'blur(0.5px)',
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </Box>

      {/* Rotating Dashboard Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '15%',
          right: '5%',
          width: '200px',
          height: '200px',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0,
        }}
        animate={{
          rotate: [0, 360],
          scale: [0.8, 1.1, 0.8],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
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

      {/* Left side geometric pattern */}
      <motion.div
        style={{
          position: 'absolute',
          top: '60%',
          left: '2%',
          width: '150px',
          height: '150px',
          opacity: 0.06,
          pointerEvents: 'none',
          zIndex: 0,
        }}
        animate={{
          rotate: [0, -360],
          y: [0, -20, 0],
        }}
        transition={{
          rotate: { duration: 30, repeat: Infinity, ease: "linear" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
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

      {/* Floating User Profile */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ProfileDropdown />
        </motion.div>
      </Box>

      {/* Floating Brand Logo */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <AIIcon sx={{ mr: 1, fontSize: 28, color: theme.palette.primary.main }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              letterSpacing: '-0.025em'
            }}
          >
            CityRoots.ai
          </Typography>
        </motion.div>
      </Box>

      <Container maxWidth="md" sx={{ py: 8, position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', minHeight: 'calc(100vh - 160px)' }}>
        <Box sx={{ width: '100%' }}>
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.8rem', md: '2rem' },
                }}
              >
                Your Urban Planning Hub
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  maxWidth: 400,
                  mx: 'auto',
                  fontSize: '0.9rem',
                }}
              >
                Choose what you'd like to do
              </Typography>
            </Box>
          </motion.div>


        {/* Dashboard Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >

          <Grid container spacing={6} justifyContent="center">
            {dashboardOptions.map((option, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      minHeight: 240,
                      background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
                      borderRadius: 3,
                      cursor: 'pointer',
                      border: `1px solid ${theme.palette.primary.main}20`,
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.1s ease',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: option.gradient,
                      },
                    }}
                    onClick={option.action}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {/* Icon Section */}
                      <Avatar
                        sx={{
                          mb: 2,
                          mx: 'auto',
                          width: 60,
                          height: 60,
                          background: option.gradient,
                          color: 'white',
                          boxShadow: `0 8px 32px ${option.color}30`,
                        }}
                      >
                        {option.icon}
                      </Avatar>

                      {/* Content */}
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: theme.palette.text.primary,
                          fontSize: { xs: '1.2rem', md: '1.4rem' },
                        }}
                      >
                        {option.title}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.text.secondary,
                          lineHeight: 1.6,
                          mb: 2,
                          flexGrow: 1,
                          fontSize: '0.95rem',
                        }}
                      >
                        {option.description}
                      </Typography>

                      {/* Action Button */}
                      <div>
                        <Button
                          variant="contained"
                          size="medium"
                          endIcon={<ArrowIcon />}
                          onClick={option.action}
                          sx={{
                            background: option.gradient,
                            py: 1,
                            px: 3,
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            borderRadius: 2,
                            boxShadow: `0 4px 16px ${option.color}30`,
                            border: 'none',
                            '&:hover': {
                              background: option.gradient,
                            },
                          }}
                        >
                          Get Started
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;