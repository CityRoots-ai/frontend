import { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { voteOnProposal, VoteTransactionResult } from '../utils/contracts';

export interface VotingState {
  isVoting: boolean;
  error: string | null;
  success: boolean;
  transactionHash: string | null;
}

export const useVoting = () => {
  const { primaryWallet } = useDynamicContext();
  const [votingState, setVotingState] = useState<VotingState>({
    isVoting: false,
    error: null,
    success: false,
    transactionHash: null
  });

  const submitVote = async (proposalId: string, voteChoice: boolean): Promise<VoteTransactionResult> => {
    setVotingState({
      isVoting: true,
      error: null,
      success: false,
      transactionHash: null
    });

    try {
      if (!primaryWallet) {
        throw new Error('Please connect your wallet first');
      }

      const result = await voteOnProposal(proposalId, voteChoice, primaryWallet);

      if (result.success) {
        setVotingState({
          isVoting: false,
          error: null,
          success: true,
          transactionHash: result.transactionHash || null
        });
      } else {
        setVotingState({
          isVoting: false,
          error: result.error || 'Vote failed',
          success: false,
          transactionHash: null
        });
      }

      return result;

    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';

      setVotingState({
        isVoting: false,
        error: errorMessage,
        success: false,
        transactionHash: null
      });

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const resetVotingState = () => {
    setVotingState({
      isVoting: false,
      error: null,
      success: false,
      transactionHash: null
    });
  };

  return {
    ...votingState,
    submitVote,
    resetVotingState
  };
};