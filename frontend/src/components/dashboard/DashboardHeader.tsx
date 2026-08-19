'use client';

import React from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SpendlyLogoIcon } from '@/components/ui/Logo';

interface DashboardHeaderProps {
  periodLabel?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function DashboardHeader({
  periodLabel = 'October 2025 — August 2026',
  onRefresh,
  isRefreshing = false,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1A2030]">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/25 text-[#34D399] text-xs font-semibold uppercase tracking-wider mb-3">
          <SpendlyLogoIcon size={14} />
          <span>Fintech Intelligence Engine</span>
        </div>
        <div className="flex items-center gap-3">
          <SpendlyLogoIcon size={38} className="hidden sm:block" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F9FAFB]">
              SPENDLY
            </h1>
            <p className="mt-0.5 text-base sm:text-lg font-medium text-[#10B981]">
              &ldquo;Your money, understood.&rdquo;
            </p>
          </div>
        </div>
        <p className="mt-2 text-sm text-[#9CA3AF] max-w-2xl leading-relaxed">
          Track spending, discover patterns, and turn successful payments into reward coins.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Period badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121624] border border-[#20273A] text-xs text-[#D1D5DB] shadow-xs">
          <Calendar className="h-4 w-4 text-[#10B981]" />
          <span className="font-medium">{periodLabel}</span>
        </div>

        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            aria-label="Refresh metrics"
          >
            Refresh
          </Button>
        )}
      </div>
    </div>
  );
}
