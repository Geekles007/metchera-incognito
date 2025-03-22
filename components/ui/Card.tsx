import React from 'react';
import { classNames } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  hoverEffect?: boolean;
}

export default function Card({
  children,
  className,
  padding = 'md',
  bordered = true,
  hoverEffect = false,
}: CardProps) {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  return (
    <div
      className={classNames(
        'bg-white dark:bg-gray-800 rounded-lg',
        bordered ? 'border border-gray-200 dark:border-gray-700' : '',
        hoverEffect ? 'transition-all duration-200 hover:shadow-lg' : '',
        paddingStyles[padding],
        className || ''
      )}
    >
      {children}
    </div>
  );
}

// Card Sections
interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardSectionProps) {
  return (
    <div
      className={classNames(
        'mb-4 pb-4 border-b border-gray-200 dark:border-gray-700',
        className || ''
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardSectionProps) {
  return (
    <h3
      className={classNames(
        'text-lg font-semibold text-gray-900 dark:text-white',
        className || ''
      )}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: CardSectionProps) {
  return (
    <p
      className={classNames(
        'text-sm text-gray-500 dark:text-gray-400',
        className || ''
      )}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className }: CardSectionProps) {
  return (
    <div className={classNames('', className || '')}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: CardSectionProps) {
  return (
    <div
      className={classNames(
        'mt-4 pt-4 border-t border-gray-200 dark:border-gray-700',
        className || ''
      )}
    >
      {children}
    </div>
  );
} 