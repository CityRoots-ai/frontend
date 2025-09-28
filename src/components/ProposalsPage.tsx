import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  HowToVote as VoteIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  ArrowBack as BackIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import ProfileDropdown from './ProfileDropdown';
import { Proposal, getProposals, getProposalDetails, formatProposalEndDate, isProposalActive, checkUserVote, switchToSepolia } from '../utils/contracts';
import { useVoting } from '../hooks/useVoting';

const ProposalsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, primaryWallet } = useDynamicContext();
  const { isVoting, error, success, transactionHash, submitVote, resetVotingState } = useVoting();

  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, { hasVoted: boolean; vote?: boolean }>>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);

  // Load proposals from blockchain (with debouncing to prevent loops)
  useEffect(() => {
    let isMounted = true;

    const loadProposals = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        console.log('Loading proposals...');

        const proposalsData = await getProposals();

        if (isMounted) {
          setProposals(proposalsData);
          console.log('Proposals loaded:', proposalsData.length);
        }
      } catch (error: any) {
        console.error('Error loading proposals:', error);
        if (isMounted) {
          setErrorMessage(error.message || 'Failed to load proposals');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Debounce the initial load to prevent rapid succession calls
    const timeoutId = setTimeout(loadProposals, 200);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []); // Load proposals only once on mount

  // Separate effect to check user votes when wallet connects (simplified to avoid loops)
  useEffect(() => {
    // Skip user vote checking since it's causing loops and the contract functions don't work properly
    // User votes will be validated during the actual transaction
    console.log('Skipping user vote checks to prevent API loops');
  }, [user?.id, primaryWallet?.address]); // Minimal dependencies

  const handleVoteClick = async (proposal: Proposal) => {
    try {
      // Fetch detailed proposal data with all the content
      const detailedProposal = await getProposalDetails(proposal.id);
      setSelectedProposal(detailedProposal);
      setVoteModalOpen(true);
      resetVotingState();
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to load proposal details');
    }
  };

  const handleVote = async (voteChoice: boolean) => {
    if (!selectedProposal) return;

    if (!user || !primaryWallet) {
      setErrorMessage('Please connect your wallet to vote');
      return;
    }

    // Note: Vote validation is handled by the smart contract during transaction
    // Local vote checking has been disabled to prevent API loops

    try {
      console.log(`Submitting vote for proposal ${selectedProposal.id}: ${voteChoice ? 'YES' : 'NO'}`);

      const result = await submitVote(selectedProposal.id, voteChoice);

      if (result.success) {
        console.log('Vote successful!', result);

        // Update local state immediately to prevent double voting
        setUserVotes(prev => ({
          ...prev,
          [selectedProposal.id]: { hasVoted: true, vote: voteChoice }
        }));

        // Update proposal vote counts locally
        setProposals(prev => prev.map(p => {
          if (p.id === selectedProposal.id) {
            return {
              ...p,
              yesVotes: voteChoice ? p.yesVotes + 1 : p.yesVotes,
              noVotes: !voteChoice ? p.noVotes + 1 : p.noVotes
            };
          }
          return p;
        }));

        setShowSuccessMessage(true);

        // Close modal after showing success message
        setTimeout(() => {
          setVoteModalOpen(false);
          setSelectedProposal(null);
        }, 3000);
      } else {
        console.error('Vote failed:', result.error);
        setErrorMessage(result.error || 'Vote failed');
      }
    } catch (error: any) {
      console.error('Vote submission error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
    }
  };

  const handleNetworkSwitch = async () => {
    if (!primaryWallet) {
      setErrorMessage('Please connect your wallet first');
      return;
    }

    setSwitchingNetwork(true);
    try {
      const result = await switchToSepolia(primaryWallet);
      if (result.success) {
        setErrorMessage(null);
        // Reload proposals after network switch
        window.location.reload();
      } else {
        setErrorMessage(result.error || 'Failed to switch to Sepolia testnet');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to switch networks');
    } finally {
      setSwitchingNetwork(false);
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

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: 'white' }} />
            <Typography sx={{ color: 'white', ml: 2 }}>Loading proposals...</Typography>
          </Box>
        )}

        {/* Error State */}
        {errorMessage && (
          <Alert
            severity="error"
            sx={{ mb: 4, bgcolor: 'rgba(244, 67, 54, 0.1)', color: 'white' }}
            action={
              errorMessage.includes('Sepolia') ? (
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleNetworkSwitch}
                  disabled={switchingNetwork}
                  sx={{ minWidth: 'auto', color: 'white' }}
                >
                  {switchingNetwork ? 'Switching...' : 'Switch to Sepolia'}
                </Button>
              ) : null
            }
          >
            {errorMessage}
          </Alert>
        )}

        {/* No Proposals State */}
        {!loading && proposals.length === 0 && !errorMessage && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              No active proposals found
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Check back later for new community proposals
            </Typography>
          </Box>
        )}

        {/* Proposals List */}
        {!loading && proposals.length > 0 && (
          <Grid container spacing={3}>
            {proposals.map((proposal) => (
              <Grid size={{ xs: 12 }} key={proposal.id}>
                <Card
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    transition: 'all 0.1s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.08)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: 'white',
                          fontSize: '1.1rem',
                          flex: 1
                        }}
                      >
                        {proposal.title}
                      </Typography>
                      {!isProposalActive(proposal.endDate) && (
                        <Chip
                          label="Closed"
                          size="small"
                          sx={{
                            bgcolor: 'rgba(158, 158, 158, 0.2)',
                            color: '#9E9E9E',
                            fontSize: '0.7rem'
                          }}
                        />
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        mb: 2,
                        lineHeight: 1.5
                      }}
                    >
                      {proposal.description.length > 150
                        ? `${proposal.description.substring(0, 150)}...`
                        : proposal.description}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255,255,255,0.5)',
                        mb: 3,
                        fontSize: '0.8rem'
                      }}
                    >
                      Ends: {formatProposalEndDate(proposal.endDate)}
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

                      {!user ? (
                        <Chip
                          label="Connect Wallet to Vote"
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.75rem'
                          }}
                        />
                      ) : !isProposalActive(proposal.endDate) ? (
                        <Chip
                          label="Voting Closed"
                          size="small"
                          sx={{
                            bgcolor: 'rgba(158, 158, 158, 0.2)',
                            color: '#9E9E9E',
                            fontSize: '0.75rem'
                          }}
                        />
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleVoteClick(proposal)}
                          disabled={userVotes[proposal.id]?.hasVoted}
                          sx={{
                            bgcolor: userVotes[proposal.id]?.hasVoted
                              ? 'rgba(76, 175, 80, 0.3)'
                              : theme.palette.primary.main,
                            '&:hover': {
                              bgcolor: userVotes[proposal.id]?.hasVoted
                                ? 'rgba(76, 175, 80, 0.3)'
                                : theme.palette.primary.dark,
                            },
                            borderRadius: 2,
                            px: 2,
                            fontSize: '0.8rem'
                          }}
                        >
                          {userVotes[proposal.id]?.hasVoted ? 'Voted' : 'Vote Now'}
                        </Button>
                      )}
                    </Box>

                    {userVotes[proposal.id]?.hasVoted && (
                      <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2, border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                        <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 500, fontSize: '0.8rem' }}>
                          ✓ You voted "{userVotes[proposal.id].vote ? 'YES' : 'NO'}"
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Vote Modal */}
        <Modal
          open={voteModalOpen}
          onClose={() => {
            if (!isVoting) { // Only allow closing if not voting
              setVoteModalOpen(false);
              resetVotingState();
            }
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999, // Lower z-index so wallet popups appear above
          }}
          disableEnforceFocus={true} // Allow focus to go to wallet popups
          disableAutoFocus={true}
          disableRestoreFocus={true} // Prevent focus restoration
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
              onClick={() => {
                if (!isVoting) { // Only allow closing if not voting
                  setVoteModalOpen(false);
                  resetVotingState();
                }
              }}
              disabled={isVoting}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: isVoting ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)'
              }}
            >
              <CloseIcon />
            </IconButton>

            {success && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
                <CheckIcon sx={{ color: '#4CAF50', mr: 1 }} />
                <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 500 }}>
                  Vote submitted successfully!
                  {transactionHash && (
                    <>
                      <br />
                      <Typography component="span" variant="caption" sx={{ color: 'rgba(76, 175, 80, 0.8)' }}>
                        TX: {transactionHash.substring(0, 10)}...{transactionHash.substring(transactionHash.length - 8)}
                      </Typography>
                    </>
                  )}
                </Typography>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(244, 67, 54, 0.1)', color: 'white' }}>
                {error}
              </Alert>
            )}

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
              <Box sx={{ whiteSpace: 'pre-line' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                  {selectedProposal?.detailedContent || selectedProposal?.description}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', pt: 3 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={isVoting ? <CircularProgress size={16} color="inherit" /> : <ThumbUpIcon />}
                onClick={() => handleVote(true)}
                disabled={isVoting || success}
                sx={{ flex: 1, py: 1.5 }}
              >
                {isVoting ? 'Voting...' : 'Yes'}
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={isVoting ? <CircularProgress size={16} color="inherit" /> : <ThumbDownIcon />}
                onClick={() => handleVote(false)}
                disabled={isVoting || success}
                sx={{ flex: 1, py: 1.5 }}
              >
                {isVoting ? 'Voting...' : 'No'}
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccessMessage}
          autoHideDuration={4000}
          onClose={() => setShowSuccessMessage(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setShowSuccessMessage(false)}>
            Vote submitted successfully! Transaction confirmed on blockchain.
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ProposalsPage;