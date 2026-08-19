'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options?: SelectOption[];
  placeholder?: string;
  leftIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
  children?: React.ReactNode;
}

export function Select({
  value,
  onChange,
  options: propOptions,
  placeholder = 'Select...',
  leftIcon,
  className,
  disabled = false,
  'aria-label': ariaLabel,
  children,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build options from children if not given via prop
  const options: SelectOption[] = React.useMemo(() => {
    if (propOptions) return propOptions;
    const parsed: SelectOption[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === 'option') {
        const props = child.props as { value?: string; children?: React.ReactNode };
        parsed.push({
          value: String(props.value ?? ''),
          label: String(props.children ?? ''),
        });
      }
    });
    return parsed;
  }, [propOptions, children]);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          'w-full flex items-center justify-between rounded-lg bg-[#121624] border border-[#20273A] text-sm text-[#F3F4F6]',
          'transition-all duration-150 cursor-pointer',
          'focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:bg-[#151A2B]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'h-9.5 py-2 pr-3',
          leftIcon ? 'pl-9.5' : 'pl-3.5',
          isOpen && 'border-[#3B82F6] ring-1 ring-[#3B82F6] bg-[#151A2B]'
        )}
      >
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-[#6B7280]">
            {leftIcon}
          </div>
        )}
        <span className={cn('truncate text-left', !selectedOption && 'text-[#6B7280]')}>
          {displayLabel}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-[#6B7280] shrink-0 ml-2 transition-transform duration-150',
            isOpen && 'rotate-180 text-[#9CA3AF]'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 py-1 rounded-lg bg-[#151926] border border-[#262F44] shadow-2xl shadow-black/60 overflow-hidden animate-fade-in"
          role="listbox"
          aria-label={ariaLabel}
        >
          <div className="max-h-56 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2 text-sm cursor-pointer transition-colors',
                    isSelected
                      ? 'bg-[#10B981]/15 text-[#34D399] font-medium'
                      : 'text-[#D1D5DB] hover:bg-[#1D2336] hover:text-[#F3F4F6]'
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-[#10B981] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
