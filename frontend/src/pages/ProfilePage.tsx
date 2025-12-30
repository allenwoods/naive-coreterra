import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductivityRadar } from '@/components/features/ProductivityRadar';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-text-main text-3xl font-bold leading-tight tracking-tight">
          Profile & Gamification
        </h1>
        <p className="text-text-secondary text-base font-normal leading-normal">
          Manage your Coreterra workflow progress, achievements, and account settings.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 flex flex-col gap-6 relative overflow-hidden">
          <div className="flex items-start gap-5 relative z-10">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl w-24 h-24 border border-border-color shadow-sm"
              style={{ backgroundImage: `url("${user?.avatar || ''}")` }}
            />
            <div className="flex flex-col pt-1">
              <h2 className="text-text-main text-2xl font-bold leading-tight">{user?.name || 'User'}</h2>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                  Level {user?.level || 0}
                </span>
                <span className="text-text-secondary text-sm font-medium">Productivity Ninja</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2 relative z-10">
            <div className="flex gap-6 justify-between items-end">
              <p className="text-text-main text-sm font-bold uppercase tracking-wider">XP Progress</p>
              <p className="text-text-secondary text-xs font-medium">
                {user?.currentXP || 0} / {user?.maxXP || 500} XP
              </p>
            </div>
            <div className="rounded-full bg-slate-100 h-2.5 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-primary rounded-full"
                style={{ width: `${((user?.currentXP || 0) / (user?.maxXP || 500)) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-500">auto_awesome</span>
            Productivity DNA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Radar Chart Visual */}
            <div className="md:col-span-5 flex justify-center items-center bg-surface-light border border-border-color rounded-2xl p-6 shadow-sm">
              {user?.stats && (
                <ProductivityRadar
                  data={{
                    focus: user.stats.focus,
                    execution: user.stats.execution,
                    planning: user.stats.planning,
                    teamwork: user.stats.teamwork,
                    expertise: user.stats.expertise,
                    streak: user.stats.streak,
                  }}
                  size={280}
                />
              )}
            </div>

            {/* Skills List */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user?.stats && [
                { name: 'Focus', value: user.stats.focus, icon: 'psychology', color: 'text-indigo-500', bg: 'bg-indigo-500', desc: 'Deep work capacity' },
                { name: 'Execution', value: user.stats.execution, icon: 'check_circle', color: 'text-emerald-500', bg: 'bg-emerald-500', desc: 'Task completion rate' },
                { name: 'Planning', value: user.stats.planning, icon: 'event_note', color: 'text-blue-500', bg: 'bg-blue-500', desc: 'Future scheduling' },
                { name: 'Teamwork', value: user.stats.teamwork, icon: 'groups', color: 'text-purple-500', bg: 'bg-purple-500', desc: 'Collaboration score' },
                { name: 'Expertise', value: user.stats.expertise, icon: 'school', color: 'text-orange-500', bg: 'bg-orange-500', desc: 'Skill proficiency' },
                { name: 'Streak', value: user.stats.streak, icon: 'local_fire_department', color: 'text-red-500', bg: 'bg-red-500', desc: 'Consistency' },
              ].map(skill => (
                <Card key={skill.name} className="hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardContent className="p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined ${skill.color}`}>{skill.icon}</span>
                        <div>
                          <span className="font-bold text-slate-800 text-sm block">{skill.name}</span>
                          <span className="text-[10px] text-slate-500 block">{skill.desc}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600 group-hover:bg-primary group-hover:text-white transition-colors">
                        Lvl {skill.value}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className={`h-full ${skill.bg}`} style={{ width: `${skill.value * 5}%` }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Summary Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500">group</span>
              Team Summary
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/team')} className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
              View Team Detail <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-surface-light border border-border-color rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                <div
                  className="size-12 rounded-full border-2 border-white bg-slate-200 bg-cover"
                  style={{ backgroundImage: 'url("https://i.pravatar.cc/150?u=a042581f4e29026024d")' }}
                />
                <div
                  className="size-12 rounded-full border-2 border-white bg-slate-300 bg-cover"
                  style={{ backgroundImage: 'url("https://i.pravatar.cc/150?u=a042581f4e29026704d")' }}
                />
                <div
                  className="size-12 rounded-full border-2 border-white bg-slate-400 bg-cover"
                  style={{ backgroundImage: 'url("https://i.pravatar.cc/150?u=a04258114e29026302d")' }}
                />
                <div className="size-12 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                  +5
                </div>
              </div>
              <div>
                <p className="font-bold text-slate-900">Engineering Team A</p>
                <p className="text-xs text-slate-500">8 Members • 5 Online</p>
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase">Team Velocity</p>
                <p className="text-lg font-bold text-slate-800">42 pts</p>
              </div>
              <div className="flex-1 md:flex-none p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase">Deadlines</p>
                <p className="text-lg font-bold text-slate-800">3 Pending</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

