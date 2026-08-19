'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't load your transactions. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] mb-4">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h4 className="text-base font-semibold text-[#F3F4F6]">{title}</h4>
      <p className="mt-1.5 text-sm text-[#9CA3AF] max-w-sm leading-relaxed">{message}</p>
      {onRetry && (
        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
