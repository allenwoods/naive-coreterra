import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { gamificationAPI } from '@/lib/api';
import type { Achievement } from '@/types';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    gamificationAPI.getAchievements().then(setAchievements);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light overflow-hidden">
      <div className="px-8 py-6 bg-surface-light border-b border-border-color flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-main tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-yellow-500 text-4xl">emoji_events</span>
            Achievements
          </h1>
          <p className="text-text-secondary mt-1">Track your milestones and badges.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500">grid_view</span>
            All Badges
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {achievements.map(ach => (
              <Card
                key={ach.id}
                className={`group relative aspect-square flex flex-col items-center justify-center gap-3 p-4 text-center transition-all ${
                  ach.unlocked
                    ? `${ach.bg} ${ach.border} border shadow-sm hover:scale-105`
                    : 'bg-slate-50 border border-slate-200 opacity-60 grayscale'
                }`}
              >
                <span className={`material-symbols-outlined text-5xl ${ach.color} drop-shadow-sm`}>
                  {ach.icon}
                </span>
                <div>
                  <span className="text-base font-bold text-slate-800 block">{ach.title}</span>
                  <span className="text-xs text-slate-500 mt-1 block">{ach.desc}</span>
                </div>
                {!ach.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 backdrop-blur-[1px] rounded-xl">
                    <span className="material-symbols-outlined text-slate-400 text-4xl">lock</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

