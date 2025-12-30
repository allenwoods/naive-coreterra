import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

export const ReviewPage: React.FC = () => {
  const { tasks } = useApp();
  const [period, setPeriod] = useState('Daily');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light overflow-hidden">
      <div className="px-8 pt-8 pb-4 flex flex-col gap-4 border-b border-border-color bg-surface-light shrink-0">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-text-main tracking-tight leading-none">
              Review & Retrospective
            </h1>
            <p className="text-text-secondary mt-1 text-base">
              Analyze your productivity, experience gained, and team collaborations.
            </p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg self-start md:self-auto">
            {['Daily', 'Weekly', 'Monthly'].map(p => (
              <Button
                key={p}
                onClick={() => setPeriod(p)}
                variant={period === p ? 'default' : 'ghost'}
                size="sm"
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Capture', count: 3, icon: 'bolt', color: 'text-slate-600', bg: 'bg-slate-100' },
            { label: 'Clarify', count: 4, icon: 'filter_list', color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Organize', count: 2, icon: 'folder_open', color: 'text-indigo-600', bg: 'bg-indigo-100' },
            { label: 'Review', count: 12, icon: 'reviews', color: 'text-emerald-600', bg: 'bg-emerald-100' },
            { label: 'Engage', count: 1, icon: 'play_circle', color: 'text-orange-600', bg: 'bg-orange-100' },
          ].map(stat => (
            <Card key={stat.label} className="group hover:border-primary/30 transition-all cursor-default">
              <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                <div className={`p-2 rounded-full ${stat.bg} ${stat.color} bg-opacity-50`}>
                  <span className="material-icons-round text-lg">{stat.icon}</span>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800 leading-none">{stat.count}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mt-1">
                    {stat.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <CardTitle className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">history</span>
              Completed Tasks
            </CardTitle>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-border-color text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Task Details</th>
                        <th className="px-6 py-4">Duration</th>
                        <th className="px-6 py-4">Reward</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { title: 'Refactor Auth Module', time: '1h 20m', xp: 150, tag: 'Dev' },
                        { title: 'Weekly Team Sync', time: '45m', xp: 50, tag: 'Meeting' },
                        { title: 'Review PR #402', time: '30m', xp: 75, tag: 'Code Review' },
                        { title: 'Update Documentation', time: '1h 00m', xp: 100, tag: 'Docs' },
                        { title: 'Fix CSS Grid Issue', time: '25m', xp: 40, tag: 'Bugfix' },
                      ].map((task, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors cursor-pointer">
                              {task.title}
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mt-1 inline-block uppercase tracking-wide">
                              {task.tag}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
                            {task.time}
                          </td>
                          <td className="px-6 py-4 text-sm text-primary font-bold">+{task.xp} XP</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <CardTitle className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">group</span>
              Collaboration
            </CardTitle>
            <Card>
              <CardContent className="p-6 flex flex-col gap-5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px]">
                        SJ
                      </div>
                      <span className="text-sm font-bold text-slate-700">Sarah Jenkins</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">2h 15m</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[65%]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-[10px]">
                        MC
                      </div>
                      <span className="text-sm font-bold text-slate-700">Michael Chen</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">45m</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full w-[25%]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white shadow-lg shadow-blue-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <span className="material-symbols-outlined text-yellow-300">emoji_events</span>
                  </div>
                  <CardTitle className="font-bold text-lg">Daily Insight</CardTitle>
                </div>
                <p className="text-blue-50 text-sm leading-relaxed mb-4 font-medium opacity-90">
                  You've maintained a <strong>High Focus</strong> state for over 2 hours today. You are 15% more productive than last Tuesday!
                </p>
                <Button className="w-full bg-white text-primary hover:bg-blue-50 transition-colors rounded-xl py-2.5 text-sm font-bold shadow-sm">
                  Share Report
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

