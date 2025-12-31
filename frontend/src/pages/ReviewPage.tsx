import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { teamsAPI, reportsAPI, type TeamMember, type Report } from '@/lib/api';

export const ReviewPage: React.FC = () => {
  const { tasks } = useApp();
  const [period, setPeriod] = useState('Daily');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [dailyReport, setDailyReport] = useState<Report | null>(null);
  const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed'), [tasks]);

  React.useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const members = await teamsAPI.getAll();
        setTeamMembers(members);
      } catch (error) {
        console.error('Failed to load team members:', error);
      }
    };
    loadTeamMembers();
  }, []);

  React.useEffect(() => {
    const loadDailyReport = async () => {
      try {
        const report = await reportsAPI.getDaily();
        setDailyReport(report);
      } catch (error) {
        console.error('Failed to load daily report:', error);
      }
    };
    loadDailyReport();
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light overflow-hidden">
      <div className="px-8 py-6 border-b border-border-color bg-surface-light shrink-0 flex justify-end items-center">
        <div className="flex bg-slate-100 p-1 rounded-lg">
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
                      {completedTasks.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-slate-400 text-sm">
                            No completed tasks yet
                          </td>
                        </tr>
                      ) : (
                        completedTasks.slice(0, 10).map((task) => {
                          // Calculate time from estimatedTime or use default
                          const time = task.estimatedTime || 'N/A';
                          const xp = task.xpReward || 0;
                          const tag = task.projectId ? 'Project' : task.difficulty || 'Task';
                          
                          return (
                            <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors cursor-pointer">
                                  {task.title}
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mt-1 inline-block uppercase tracking-wide">
                                  {tag}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600 font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
                                {time}
                              </td>
                              <td className="px-6 py-4 text-sm text-primary font-bold">+{xp} XP</td>
                            </tr>
                          );
                        })
                      )}
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
                {teamMembers.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 text-sm">
                    No collaboration data available
                  </div>
                ) : (
                  teamMembers.slice(0, 5).map((member, index) => {
                    // Calculate collaboration time from tasks assigned to this member
                    const memberTasks = tasks.filter(t => t.assigneeId === member.id && t.status === 'completed');
                    const totalTime = memberTasks.reduce((sum, task) => {
                      const timeStr = task.estimatedTime || '0m';
                      const match = timeStr.match(/(\d+)([hm])/);
                      if (match) {
                        const value = parseInt(match[1]);
                        const unit = match[2];
                        return sum + (unit === 'h' ? value * 60 : value);
                      }
                      return sum;
                    }, 0);
                    const hours = Math.floor(totalTime / 60);
                    const minutes = totalTime % 60;
                    const timeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                    
                    // Calculate percentage (mock calculation based on capacity)
                    const percentage = Math.min(member.capacity, 100);
                    
                    // Get initials for avatar
                    const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();
                    
                    // Color based on index
                    const colors = [
                      { bg: 'bg-indigo-100', text: 'text-indigo-600', bar: 'bg-indigo-500' },
                      { bg: 'bg-purple-100', text: 'text-purple-600', bar: 'bg-purple-500' },
                      { bg: 'bg-blue-100', text: 'text-blue-600', bar: 'bg-blue-500' },
                      { bg: 'bg-green-100', text: 'text-green-600', bar: 'bg-green-500' },
                      { bg: 'bg-orange-100', text: 'text-orange-600', bar: 'bg-orange-500' },
                    ];
                    const color = colors[index % colors.length];
                    
                    return (
                      <div key={member.id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className={`size-6 rounded-full ${color.bg} ${color.text} flex items-center justify-center font-bold text-[10px]`}>
                              {initials}
                            </div>
                            <span className="text-sm font-bold text-slate-700">{member.name}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-900">{timeDisplay}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className={`${color.bar} h-full`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white shadow-lg shadow-blue-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <span className="material-symbols-outlined text-yellow-300">
                      {dailyReport?.icon || 'emoji_events'}
                    </span>
                  </div>
                  <CardTitle className="font-bold text-lg">
                    {dailyReport?.title || 'Daily Insight'}
                  </CardTitle>
                </div>
                {dailyReport ? (
                  <p 
                    className="text-blue-50 text-sm leading-relaxed mb-4 font-medium opacity-90"
                    dangerouslySetInnerHTML={{ __html: dailyReport.content }}
                  />
                ) : (
                  <p className="text-blue-50 text-sm leading-relaxed mb-4 font-medium opacity-90">
                    Loading insight...
                  </p>
                )}
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

