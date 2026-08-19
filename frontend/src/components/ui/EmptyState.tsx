'use client';

import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No transactions found',
  description = 'Try adjusting your filters or clearing one of the active filters.',
  actionLabel = 'Clear all filters',
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-[#171B2B] border border-[#262F44] text-[#9CA3AF] mb-4 shadow-inner">
        {icon || <SearchX className="h-7 w-7 text-[#6B7280]" />}
      </div>
      <h4 className="text-base font-semibold text-[#F3F4F6]">{title}</h4>
      <p className="mt-1.5 text-sm text-[#9CA3AF] max-w-sm leading-relaxed">{description}</p>
      {onAction && (
        <div className="mt-6">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
