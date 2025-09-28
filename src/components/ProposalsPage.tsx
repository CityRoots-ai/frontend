import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Chip,
  useTheme,
  Modal,
} from '@mui/material';
import {
  HowToVote as VoteIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  ArrowBack as BackIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

interface Proposal {
  id: string;
  title: string;
  description: string;
  yesVotes: number;
  noVotes: number;
}

const ProposalsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, 'yes' | 'no'>>({});

  const mockProposals: Proposal[] = [
    {
      id: '1',
      title: 'Convert Parking Lot to Community Garden',
      description: 'Transform unused parking lot into community garden space.',
      yesVotes: 156,
      noVotes: 23,
    },
    {
      id: '2',
      title: 'Remove Riverside Park for Development',
      description: 'Replace Riverside Park with mixed-use complex.',
      yesVotes: 89,
      noVotes: 267,
    },
    {
      id: '3',
      title: 'Install Solar Panels in Central Park',
      description: 'Add solar panel canopies over picnic areas.',
      yesVotes: 234,
      noVotes: 45,
    },
  ];

  const handleVoteClick = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setVoteModalOpen(true);
  };

  const handleVote = (vote: 'yes' | 'no') => {
    if (selectedProposal) {
      setUserVotes(prev => ({ ...prev, [selectedProposal.id]: vote }));
      setVoteModalOpen(false);
      setSelectedProposal(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#1A1B3A',
        position: 'relative',
      }}
    >
      {/* Floating Back Button */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
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
          <BackIcon sx={{ color: theme.palette.primary.main }} />
        </IconButton>
      </Box>

      {/* Floating Brand Logo */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <VoteIcon sx={{ mr: 1, fontSize: 24, color: theme.palette.primary.main }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              letterSpacing: '-0.025em',
              fontSize: '1.1rem'
            }}
          >
            Proposals
          </Typography>
        </Box>
      </Box>

      {/* Floating User Profile */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10,
        }}
      >
        <ProfileDropdown />
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ pt: 10, pb: 4, position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: 'white',
            textAlign: 'center',
          }}
        >
          Community Proposals
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255,255,255,0.7)',
            mb: 4,
            textAlign: 'center',
          }}
        >
          Vote on urban planning proposals
        </Typography>

        {/* Proposals List */}
        <Grid container spacing={3}>
          {mockProposals.map((proposal) => (
            <Grid size={{ xs: 12 }} key={proposal.id}>
              <Card
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: 'white',
                      fontSize: '1.1rem'
                    }}
                  >
                    {proposal.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      mb: 3,
                      lineHeight: 1.5
                    }}
                  >
                    {proposal.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={`${proposal.yesVotes} Yes`}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(76, 175, 80, 0.2)',
                          color: '#4CAF50',
                          fontSize: '0.75rem'
                        }}
                      />
                      <Chip
                        label={`${proposal.noVotes} No`}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(244, 67, 54, 0.2)',
                          color: '#F44336',
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>

                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleVoteClick(proposal)}
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark,
                        },
                        borderRadius: 2,
                        px: 2,
                        fontSize: '0.8rem'
                      }}
                    >
                      Vote Now
                    </Button>
                  </Box>

                  {userVotes[proposal.id] && (
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2, border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                      <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 500, fontSize: '0.8rem' }}>
                        ✓ You voted "{userVotes[proposal.id].toUpperCase()}"
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Vote Modal */}
        <Modal
          open={voteModalOpen}
          onClose={() => setVoteModalOpen(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              bgcolor: '#1A1B3A',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 3,
              p: 4,
              maxWidth: 600,
              width: '90%',
              height: '80vh',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <IconButton
              onClick={() => setVoteModalOpen(false)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'rgba(255,255,255,0.7)'
              }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Vote on Proposal
            </Typography>

            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
              {selectedProposal?.title}
            </Typography>

            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                mb: 3,
                pr: 1,
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(99, 102, 241, 0.5)',
                  borderRadius: '3px',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.7)',
                  },
                },
              }}
            >
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, lineHeight: 1.6 }}>
                <strong>Proposal Details:</strong>
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, lineHeight: 1.6 }}>
                {selectedProposal?.description}
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, lineHeight: 1.6 }}>
                <strong>Impact Assessment:</strong>
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, lineHeight: 1.6 }}>
                This proposal has been thoroughly reviewed by the urban planning committee and community stakeholders. The implementation would affect approximately 2,500 residents in the surrounding area and is expected to have significant environmental and social implications.
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, lineHeight: 1.6 }}>
                <strong>Environmental Benefits:</strong>
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, lineHeight: 1.6 }}>
                • Reduction in carbon footprint by an estimated 15%<br/>
                • Improved air quality in the immediate vicinity<br/>
                • Enhanced biodiversity through native plant integration<br/>
                • Sustainable water management systems<br/>
                • Renewable energy integration where applicable
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, lineHeight: 1.6 }}>
                <strong>Community Benefits:</strong>
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, lineHeight: 1.6 }}>
                • Increased recreational spaces for families<br/>
                • Enhanced property values in the neighborhood<br/>
                • Improved walkability and accessibility<br/>
                • New job opportunities during construction and maintenance<br/>
                • Educational opportunities for local schools
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, lineHeight: 1.6 }}>
                <strong>Implementation Timeline:</strong>
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, lineHeight: 1.6 }}>
                Phase 1 (Months 1-3): Community consultation and design finalization<br/>
                Phase 2 (Months 4-8): Permit acquisition and contractor selection<br/>
                Phase 3 (Months 9-18): Construction and implementation<br/>
                Phase 4 (Months 19-24): Monitoring and adjustment period
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, lineHeight: 1.6 }}>
                <strong>Budget Breakdown:</strong>
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, lineHeight: 1.6 }}>
                Total estimated cost: $2.8 million<br/>
                • Design and planning: $350,000<br/>
                • Materials and construction: $1,900,000<br/>
                • Environmental assessments: $150,000<br/>
                • Community engagement: $75,000<br/>
                • Contingency fund: $325,000
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, lineHeight: 1.6 }}>
                <strong>Funding Sources:</strong>
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, lineHeight: 1.6 }}>
                • Municipal budget allocation: 45%<br/>
                • State environmental grants: 30%<br/>
                • Federal infrastructure funding: 20%<br/>
                • Community fundraising: 5%
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, lineHeight: 1.6 }}>
                <strong>Considerations:</strong>
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, lineHeight: 1.6 }}>
                Please consider the long-term impact on our community. This proposal represents a significant investment in our neighborhood's future and will affect generations to come. Your vote matters and helps shape the direction of our urban development initiatives.
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2, lineHeight: 1.6 }}>
                By voting, you acknowledge that you have read and understood the full proposal details and environmental impact assessment.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', pt: 3 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<ThumbUpIcon />}
                onClick={() => handleVote('yes')}
                sx={{ flex: 1, py: 1.5 }}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<ThumbDownIcon />}
                onClick={() => handleVote('no')}
                sx={{ flex: 1, py: 1.5 }}
              >
                No
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default ProposalsPage;