import React, { useState } from 'react';
import {
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Chip,
  Snackbar,
  Alert,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Person as PersonIcon,
  KeyboardArrowDown as ArrowDownIcon,
  ContentCopy as CopyIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const ProfileDropdown: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, primaryWallet, handleLogOut } = useDynamicContext();
  const open = Boolean(anchorEl);

  // Get wallet address from Dynamic
  const walletAddress = primaryWallet?.address || '';

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyAddress = async () => {
    try {
      if (walletAddress) {
        await navigator.clipboard.writeText(walletAddress);
        setCopySuccess(true);
        handleClose();
      }
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      handleClose();
      await handleLogOut();
      navigate('/');
    } catch (err) {
      console.error('Failed to sign out:', err);
      navigate('/');
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Don't render if user is not authenticated
  if (!user || !primaryWallet) {
    return null;
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={handleClick}
          sx={{
            bgcolor: 'rgba(99, 102, 241, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            '&:hover': {
              bgcolor: 'rgba(99, 102, 241, 0.2)',
            },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            borderRadius: 50,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'white',
              color: theme.palette.primary.main,
            }}
          >
            <PersonIcon />
          </Avatar>
          <ArrowDownIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          mt: 1,
          '& .MuiPaper-root': {
            borderRadius: 3,
            minWidth: 280,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            bgcolor: '#1A1B3A',
            color: 'white',
          },
        }}
      >
        {/* User Info Section */}
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
            Connected Wallet
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500, color: 'white' }}>
              {truncateAddress(walletAddress)}
            </Typography>
            <Chip
              label="Connected"
              size="small"
              color="success"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          </Box>
        </Box>

        <Divider />

        {/* Copy Address */}
        <MenuItem onClick={handleCopyAddress} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <CopyIcon fontSize="small" sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" sx={{ color: 'white' }}>Copy Address</Typography>
          </ListItemText>
        </MenuItem>

        <Divider />

        {/* Sign Out */}
        <MenuItem onClick={handleSignOut} sx={{ py: 1.5, color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" color="error.main">
              Sign Out
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setCopySuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Wallet address copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfileDropdown;