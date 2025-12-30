import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-light/90 backdrop-blur-md border-t border-border-color py-3 px-6 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)] z-50 flex justify-between">
      <Link
        to="/"
        className={cn(
          'flex flex-col items-center gap-1',
          isActive('/') ? 'text-primary' : 'text-text-secondary hover:text-primary'
        )}
      >
        <span className="material-symbols-outlined">dashboard</span>
        <span className="text-[10px]">Home</span>
      </Link>
      <Link
        to="/inbox"
        className={cn(
          'flex flex-col items-center gap-1',
          isActive('/inbox') ? 'text-primary' : 'text-text-secondary hover:text-primary'
        )}
      >
        <span className="material-symbols-outlined">inbox</span>
        <span className="text-[10px]">Inbox</span>
      </Link>
      <Link
        to="/engage"
        className="flex flex-col items-center gap-1 text-primary"
      >
        <div className="bg-primary text-white p-2 rounded-full -mt-6 shadow-lg border-4 border-white">
          <span className="material-symbols-outlined">play_arrow</span>
        </div>
      </Link>
      <Link
        to="/calendar"
        className={cn(
          'flex flex-col items-center gap-1',
          isActive('/calendar') ? 'text-primary' : 'text-text-secondary hover:text-primary'
        )}
      >
        <span className="material-symbols-outlined">calendar_month</span>
        <span className="text-[10px]">Cal</span>
      </Link>
      <Link
        to="/profile"
        className={cn(
          'flex flex-col items-center gap-1',
          isActive('/profile') ? 'text-primary' : 'text-text-secondary hover:text-primary'
        )}
      >
        <span className="material-symbols-outlined">person</span>
        <span className="text-[10px]">Profile</span>
      </Link>
    </nav>
  );
};

