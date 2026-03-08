'use client';

import { ThemeToggle } from '../theme-toggle';

interface HeaderProps {
  title?: string;
  action?: React.ReactNode;
}

export function Header({ title, action }: HeaderProps) {
  return (
    <header className="stn-header sticky top-0 z-10 px-4 pt-4">
      <div className="glass-surface flex h-14 items-center justify-between rounded-[calc(var(--radius)+12px)] px-6">
        <div className="flex items-center space-x-4">
          {title && <h1 className="text-lg font-semibold">{title}</h1>}
        </div>
        <div className="flex items-center space-x-4">
          {action}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
