'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CategoryAnalyticsItem } from '@/types';
import { formatINR, formatNumber } from '@/lib/formatters';
import { PieChart as PieIcon, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SpendingByCategoryProps {
  data: CategoryAnalyticsItem[];
  selectedCategory?: string;
  onSelectCategory?: (category: string | undefined) => void;
}

export function SpendingByCategory({
  data,
  selectedCategory,
  onSelectCategory,
}: SpendingByCategoryProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const totalSpending = data.reduce((acc, curr) => acc + curr.amount, 0);

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: CategoryAnalyticsItem }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-xl bg-[#171B2B] border border-[#2B354C] p-3 shadow-xl backdrop-blur-md text-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-semibold text-[#F3F4F6]">{item.category}</span>
          </div>
          <div className="font-mono text-sm font-bold text-[#10B981] mb-1">
            {formatINR(item.amount)}
          </div>
          <div className="flex justify-between gap-4 text-[#9CA3AF]">
            <span>Share: {item.percentage}%</span>
            <span>{formatNumber(item.count)} txns</span>
          </div>
          <div className="mt-2 pt-1.5 border-t border-[#252E44] text-[10px] text-[#60A5FA]">
            Click slice to filter table
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
          <PieIcon className="h-4 w-4 text-[#10B981]" />
          <CardTitle className="text-[#F3F4F6] text-base font-semibold">
            Where your money goes
          </CardTitle>
        </div>

        {selectedCategory && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 flex items-center gap-1">
              <Filter className="h-3 w-3" />
              {selectedCategory}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectCategory?.(undefined)}
              className="h-6 px-1.5 text-xs text-[#9CA3AF] hover:text-[#F3F4F6]"
              aria-label="Clear category filter"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-2">
        {/* Chart area */}
        <div className="h-[210px] w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <RechartsTooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="amount"
                nameKey="category"
                cursor="pointer"
                onClick={(entry: unknown) => {
                  const item = entry as { category?: string; payload?: { category?: string } };
                  const clickedCat = item?.payload?.category || item?.category;
                  if (clickedCat) {
                    if (selectedCategory === clickedCat) {
                      onSelectCategory?.(undefined);
                    } else {
                      onSelectCategory?.(clickedCat);
                    }
                  }
                }}
                onMouseEnter={(_, index) => setHoveredCategory(data[index]?.category || null)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {data.map((entry) => {
                  const isSelected = selectedCategory === entry.category;
                  const isHovered = hoveredCategory === entry.category;
                  const opacity =
                    selectedCategory && !isSelected
                      ? 0.35
                      : isHovered
                      ? 1
                      : 0.9;

                  return (
                    <Cell
                      key={`cell-${entry.category}`}
                      fill={entry.color}
                      stroke={isSelected ? '#FFFFFF' : '#111420'}
                      strokeWidth={isSelected ? 2 : 1}
                      fillOpacity={opacity}
                      className="transition-all duration-200"
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text in donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase font-semibold text-[#9CA3AF] tracking-wider">
              {selectedCategory || 'Total'}
            </span>
            <span className="text-xs font-bold font-mono text-[#F3F4F6]">
              {selectedCategory
                ? `${data.find((d) => d.category === selectedCategory)?.percentage || 0}%`
                : formatINR(totalSpending, false)}
            </span>
          </div>
        </div>

        {/* Legend list */}
        <div className="mt-4 pt-3 border-t border-[#1E2436] grid grid-cols-2 gap-2 text-xs">
          {data.slice(0, 8).map((item) => {
            const isSelected = selectedCategory === item.category;
            return (
              <button
                key={item.category}
                type="button"
                onClick={() =>
                  onSelectCategory?.(isSelected ? undefined : item.category)
                }
                className={`flex items-center justify-between p-1.5 rounded-lg text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 font-semibold'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#171B2B]'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.category}</span>
                </div>
                <span className="font-mono text-[11px] shrink-0 font-medium ml-1">
                  {item.percentage}%
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
