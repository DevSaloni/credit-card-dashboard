'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { MonthlySpendingItem } from '@/types';
import { formatCompactINR, formatINR, formatNumber } from '@/lib/formatters';
import { TrendingUp } from 'lucide-react';

interface MonthlySpendingProps {
  data: MonthlySpendingItem[];
}

export function MonthlySpending({ data }: MonthlySpendingProps) {
  // Custom Dark Tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; payload: MonthlySpendingItem }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-xl bg-[#171B2B] border border-[#2B354C] p-3 shadow-xl backdrop-blur-md text-xs">
          <div className="text-[#9CA3AF] mb-1 font-medium">{label}</div>
          <div className="font-mono text-sm font-bold text-[#38BDF8] mb-1">
            {formatINR(item.successAmount)}
          </div>
          <div className="flex flex-col gap-1 text-[#9CA3AF] text-[11px] pt-1 border-t border-[#252E44]">
            <div className="flex justify-between gap-4">
              <span>Settled Volume:</span>
              <span className="text-[#34D399] font-medium">{formatINR(item.successAmount)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Failed / Declined:</span>
              <span className="text-[#F87171] font-medium">{formatINR(item.failedAmount)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Total Transactions:</span>
              <span className="text-[#F3F4F6] font-mono">{formatNumber(item.count)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card elevated className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#38BDF8]" />
          <CardTitle className="text-[#F3F4F6] text-base font-semibold">
            Monthly spending
          </CardTitle>
        </div>
        <span className="text-xs text-[#9CA3AF] font-medium">Settled volume over time</span>
      </CardHeader>

      <CardContent className="flex-1 pt-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1F283D" vertical={false} />

              <XAxis
                dataKey="monthLabel"
                stroke="#6B7280"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#1F283D' }}
              />

              <YAxis
                stroke="#6B7280"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => formatCompactINR(val)}
              />

              <RechartsTooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="successAmount"
                name="Settled Spending"
                stroke="#38BDF8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#spendingGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
