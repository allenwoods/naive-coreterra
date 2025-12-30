import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const GlobalHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  return (
    <header className="bg-surface-light border-b border-border-color py-2 px-4 md:px-6 sticky top-0 z-30 shadow-sm flex items-center justify-between gap-4 shrink-0 h-14">
      {/* User Avatar */}
      <div
        onClick={() => navigate('/profile')}
        className="flex items-center gap-3 cursor-pointer group shrink-0 min-w-[180px]"
      >
        <div
          className="size-9 rounded-full bg-cover bg-center ring-2 ring-white shadow-sm group-hover:ring-primary/20 transition-all shrink-0"
          style={{ backgroundImage: `url("${user?.avatar || ''}")` }}
        />
        <div className="hidden md:block">
          <div className="text-sm font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">
            {user?.name || 'User'}
          </div>
          <div className="text-xs text-slate-500">Level {user?.level || 0}</div>
        </div>
      </div>

      {/* Logo & Capture Input */}
      <div className="flex-1 max-w-2xl mx-auto flex items-center justify-center px-4">
        <div className="w-full max-w-lg relative group">
          <div
            className="absolute inset-y-0 left-2 flex items-center gap-2 z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/');
            }}
          >
            <div className="size-8 rounded-lg flex items-center justify-center text-primary hover:bg-slate-200/50 transition-colors">
              <span className="material-symbols-outlined text-[24px]">deployed_code</span>
            </div>
            <span className="font-display font-bold text-lg text-slate-800 tracking-tight hidden sm:block">
              Coreterra
            </span>
            <div className="h-4 w-px bg-slate-300/50 hidden sm:block mx-1" />
          </div>

          <Input
            onClick={() => navigate('/capture')}
            className="w-full pl-12 sm:pl-36 pr-12 py-2.5 bg-slate-100 border border-transparent hover:bg-slate-200/50 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 rounded-xl transition-all text-sm font-medium placeholder-slate-500 cursor-pointer shadow-sm"
            placeholder="Capture Palette..."
            type="text"
            readOnly
          />
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1.5 rounded hidden sm:block">
              ⌘K
            </span>
          </div>
        </div>
      </div>

      {/* Calendar & Notifications */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/notifications')}
          className="relative"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/calendar')}
        >
          <span className="material-symbols-outlined text-[20px]">calendar_month</span>
        </Button>
      </div>
    </header>
  );
};

