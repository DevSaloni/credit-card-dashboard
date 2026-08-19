'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getBalance, redeemReward as apiRedeemReward } from '@/lib/api';
import { RedemptionRecord } from '@/types';

interface RewardContextType {
  balance: number;
  isLoadingBalance: boolean;
  history: RedemptionRecord[];
  refreshBalance: () => Promise<void>;
  redeem: (rewardId: string) => Promise<{ success: boolean; newBalance: number; redemption?: RedemptionRecord; error?: string }>;
}

const RewardContext = createContext<RewardContextType | undefined>(undefined);

export function RewardProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(true);
  const [history, setHistory] = useState<RedemptionRecord[]>([]);

  const refreshBalance = useCallback(async () => {
    try {
      const b = await getBalance();
      setBalance(b);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  const redeem = async (rewardId: string) => {
    const res = await apiRedeemReward(rewardId);
    if (res.success) {
      setBalance(res.newBalance);
      if (res.redemption) {
        setHistory((prev) => [res.redemption!, ...prev]);
      }
    }
    return res;
  };

  return (
    <RewardContext.Provider
      value={{
        balance,
        isLoadingBalance,
        history,
        refreshBalance,
        redeem,
      }}
    >
      {children}
    </RewardContext.Provider>
  );
}

export function useRewards() {
  const context = useContext(RewardContext);
  if (!context) {
    throw new Error('useRewards must be used within a RewardProvider');
  }
  return context;
}
