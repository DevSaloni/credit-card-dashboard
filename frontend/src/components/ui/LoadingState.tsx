import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-[#1D2333]/70', className)}
      {...props}
    />
  );
}

export function TableSkeletonRows({ rowCount = 8 }: { rowCount?: number }) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, i) => (
        <tr key={i} className="border-b border-[#1A1F2E]">
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-20" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-32" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-20 ml-auto" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-6 w-16 rounded-full" />
          </td>
          <td className="py-4 px-4 text-right">
            <Skeleton className="h-7 w-14 ml-auto rounded-lg" />
          </td>
        </tr>
      ))}
    </>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#1F2637] bg-[#111420] p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="mt-2 h-3.5 w-20" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-[#1F2637] bg-[#111420] p-6"
      style={{ height }}
    >
      <div className="w-full flex justify-between mb-4">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex-1 w-full flex items-end gap-3 pt-6 pb-2 px-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-sm"
            style={{ height: `${20 + (i * 17) % 80}%` }}
          />
        ))}
      </div>
    </div>
  );
}
