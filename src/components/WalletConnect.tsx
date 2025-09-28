import React from 'react';
import { Button } from '@mui/material';
import { AccountBalanceWallet as WalletIcon } from '@mui/icons-material';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useNavigate } from 'react-router-dom';

interface WalletConnectProps {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  sx?: any;
  children?: React.ReactNode;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  variant = 'contained',
  size = 'large',
  fullWidth = false,
  sx,
  children,
}) => {
  const { setShowAuthFlow, user } = useDynamicContext();
  const navigate = useNavigate();

  const handleConnect = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setShowAuthFlow(true);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={handleConnect}
      startIcon={<WalletIcon />}
      sx={sx}
    >
      {children || (user ? 'Enter Dashboard' : 'Connect Wallet')}
    </Button>
  );
};

export default WalletConnect;