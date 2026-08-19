'use client';

import React, { useState, useEffect } from 'react';
import { Reward } from '@/types';
import { getRewards } from '@/lib/api';
import { RewardCard } from './RewardCard';
import { RedeemModal } from './RedeemModal';
import { useRewards } from '@/context/RewardContext';
import { Skeleton } from '@/components/ui/LoadingState';

export function RewardsGrid() {
  const { balance } = useRewards();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRewards();
        setRewards(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleSelectRedeem = (reward: Reward) => {
    setSelectedReward(reward);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[#1F2637] bg-[#111420] p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="pt-4 border-t border-[#1C2234] space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            userBalance={balance}
            onSelectRedeem={handleSelectRedeem}
          />
        ))}
      </div>

      <RedeemModal
        reward={selectedReward}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
