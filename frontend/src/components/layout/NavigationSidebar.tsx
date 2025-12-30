import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const NavigationSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-20 md:w-64 bg-surface-light border-r border-border-color flex flex-col shrink-0 h-full z-20 transition-all hidden md:flex pt-4">
      <nav className="flex-1 flex flex-col gap-4 p-2 md:p-4 overflow-y-auto">
        {/* Workspace Group */}
        <div className="flex flex-col gap-1">
          <Link
            to="/"
            className={cn(
              'group flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium',
              isActive('/')
                ? 'bg-primary-light text-primary font-bold shadow-sm ring-1 ring-blue-100'
                : 'text-text-main hover:bg-slate-50'
            )}
          >
            <span className={cn('material-symbols-outlined', isActive('/') && 'fill')}>
              dashboard
            </span>
            <span className="hidden md:block">Workspace</span>
          </Link>
          <div className="flex flex-col gap-0.5 md:pl-3 ml-2 border-l border-slate-200">
            <Link
              to="/inbox"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                isActive('/inbox')
                  ? 'text-primary font-bold bg-slate-50'
                  : 'text-text-secondary hover:text-text-main hover:bg-slate-50'
              )}
            >
              <span className="material-symbols-outlined text-[18px]">inbox</span>
              <span className="hidden md:block">Inbox</span>
            </Link>
            <Link
              to="/organize"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                isActive('/organize')
                  ? 'text-primary font-bold bg-slate-50'
                  : 'text-text-secondary hover:text-text-main hover:bg-slate-50'
              )}
            >
              <span className="material-symbols-outlined text-[18px]">folder</span>
              <span className="hidden md:block">Organize</span>
            </Link>
          </div>
        </div>

        {/* Review */}
        <Link
          to="/review"
          className={cn(
            'group flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium',
            isActive('/review')
              ? 'bg-primary-light text-primary font-bold shadow-sm ring-1 ring-blue-100'
              : 'text-text-main hover:bg-slate-50'
          )}
        >
          <span className={cn('material-symbols-outlined', isActive('/review') && 'fill')}>
            reviews
          </span>
          <span className="hidden md:block">Review</span>
        </Link>

        {/* Engage */}
        <Link
          to="/engage"
          className={cn(
            'group flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium',
            isActive('/engage')
              ? 'bg-primary-light text-primary font-bold shadow-sm ring-1 ring-blue-100'
              : 'text-text-main hover:bg-slate-50'
          )}
        >
          <span className={cn('material-symbols-outlined', isActive('/engage') && 'fill')}>
            check_box
          </span>
          <span className="hidden md:block">Engage</span>
        </Link>

        {/* Game Group */}
        <div className="flex flex-col gap-1">
          <div className="px-3 py-1 text-xs font-bold text-text-secondary uppercase tracking-wider hidden md:block opacity-60">
            Game
          </div>
          <div className="flex flex-col gap-0.5">
            <Link
              to="/achievements"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                isActive('/achievements')
                  ? 'bg-slate-100 text-primary font-bold'
                  : 'text-text-secondary hover:text-text-main hover:bg-slate-50'
              )}
            >
              <span className="material-symbols-outlined text-[18px]">emoji_events</span>
              <span className="hidden md:block">Achievement</span>
            </Link>
            <Link
              to="/shop"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                isActive('/shop')
                  ? 'bg-slate-100 text-primary font-bold'
                  : 'text-text-secondary hover:text-text-main hover:bg-slate-50'
              )}
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span className="hidden md:block">Shop</span>
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
};

