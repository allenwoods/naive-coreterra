import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { contextsAPI, type Context } from '@/lib/api';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, projects, user } = useApp();
  const [contexts, setContexts] = useState<Context[]>([]);

  useEffect(() => {
    const loadContexts = async () => {
      try {
        const contextsData = await contextsAPI.getAll();
        setContexts(contextsData);
      } catch (error) {
        console.error('Failed to load contexts:', error);
      }
    };
    loadContexts();
  }, []);

  const inboxTasks = tasks.filter(t => t.status === 'inbox');
  const organizedTasks = tasks.filter(t => t.status === 'organized' || t.status === 'clarified');

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light overflow-hidden relative">
      <main className="flex-1 w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-32 overflow-y-auto">
        <div className="col-span-12 flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-text-main">
              Good Morning, {user?.name || 'User'}
            </h2>
            <p className="text-sm text-text-secondary">Here is your daily overview.</p>
          </div>
          <div className="text-sm text-primary font-medium bg-primary-light px-3 py-1 rounded-full border border-primary/20">
            Today: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Streak & Achievement Board */}
        <div className="col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Streak Section */}
          <Card className="lg:col-span-1 relative overflow-hidden">
            <CardContent className="p-6 flex flex-col justify-center items-center text-center">
              <div className="relative z-10 w-full">
                <div className="flex items-center justify-center mb-4 relative">
                  <div className="absolute inset-0 bg-orange-100 blur-2xl rounded-full opacity-60" />
                  <span className="material-symbols-outlined text-[80px] text-orange-500 animate-pulse drop-shadow-sm">
                    local_fire_department
                  </span>
                </div>
                <div className="text-5xl font-black text-slate-800 mb-2">
                  {user?.streak || 0} Days
                </div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">
                  Focus Streak
                </div>

                <div className="w-full bg-slate-50 rounded-full h-10 flex items-center justify-between px-1 relative border border-slate-200">
                  <div
                    className="absolute inset-y-1 left-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full z-0 shadow-sm"
                    style={{ width: `${((user?.currentXP || 0) / (user?.maxXP || 500)) * 100}%` }}
                  />
                  <span className="relative z-10 text-[10px] font-bold px-3 text-white">
                    Level {user?.level || 0}
                  </span>
                  <span className="relative z-10 text-[10px] font-bold px-3 text-slate-400">
                    Level {(user?.level || 0) + 1}
                  </span>
                </div>
                <div className="mt-4 flex gap-2 w-full">
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg shadow-md shadow-orange-500/20">
                    Extend (10 Gold)
                  </Button>
                  <Button variant="outline" className="flex-1 text-xs font-bold py-2 rounded-lg">
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Grid */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-yellow-500">emoji_events</span>
                  Recent Achievements
                </CardTitle>
                <Link to="/achievements" className="text-xs font-bold text-primary hover:underline">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Achievement cards would go here */}
                <div className="aspect-square rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 flex flex-col items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-4xl text-yellow-500">military_tech</span>
                  <span className="text-xs font-bold text-slate-700">Inbox Zero</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inbox Preview */}
        <Card className="lg:col-span-12">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white rounded-lg shadow-sm text-primary">
                  <span className="material-icons-round">inbox</span>
                </div>
                <CardTitle>Inbox Summary</CardTitle>
              </div>
              <Link to="/inbox" className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover">
                Process Inbox <span className="material-icons-round text-sm">arrow_forward</span>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex flex-col justify-center items-center text-center gap-1">
                <span className="text-3xl font-bold text-slate-800">{inboxTasks.length}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Added Today</span>
              </div>
              <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 flex flex-col justify-center items-center text-center gap-1">
                <span className="text-3xl font-bold text-slate-800">
                  {tasks.filter(t => t.status === 'clarified').length}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">To Clarify</span>
              </div>
              <div className="bg-red-50/50 rounded-xl p-4 border border-red-100 flex flex-col justify-center items-center text-center gap-1">
                <span className="text-3xl font-bold text-slate-800">1</span>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">&gt; 7 Days Old</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organize Summary */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white rounded-lg shadow-sm text-primary">
                  <span className="material-icons-round">folder_open</span>
                </div>
                <CardTitle>Organize Overview</CardTitle>
              </div>
              <Link to="/organize" className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1">
                Go to Organize <span className="material-icons-round text-sm">arrow_forward</span>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-6 grid grid-cols-2 md:grid-cols-2 gap-4">
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex flex-col justify-center gap-1">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                  <span className="text-xs font-bold uppercase tracking-wider">Projects</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">{projects.length} Active</div>
                <div className="text-xs text-slate-500">
                  {projects.map(p => p.title).join(', ')}
                </div>
              </div>
              <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 flex flex-col justify-center gap-1">
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                  <span className="material-symbols-outlined text-[20px]">bookmark</span>
                  <span className="text-xs font-bold uppercase tracking-wider">Contexts</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">{contexts.length} Lists</div>
                <div className="text-xs text-slate-500">
                  {contexts.length > 0 
                    ? contexts.slice(0, 3).map(c => c.name).join(', ') + (contexts.length > 3 ? '...' : '')
                    : 'No contexts'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engage Summary */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white rounded-lg shadow-sm text-primary">
                  <span className="material-icons-round">bolt</span>
                </div>
                <CardTitle>Engage Summary</CardTitle>
              </div>
              <Button
                onClick={() => navigate('/engage')}
                className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
              >
                <span>Engage Mode</span>
                <span className="material-icons-round text-sm">play_arrow</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex-1 p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-slate-800">
                    {tasks.filter(t => t.status === 'clarified').length}
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide mt-0.5">To Clarify</span>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-slate-800">3</span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mt-0.5">Due Today</span>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                  Focus for Today
                </h4>
                <div className="space-y-2">
                  {organizedTasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white hover:border-primary/30 hover:shadow-sm transition-all group cursor-pointer"
                      onClick={() => navigate(`/task-details?id=${task.id}`)}
                    >
                      <div className="size-4 rounded-full border-2 border-slate-300 group-hover:border-primary group-hover:bg-primary/10 transition-colors" />
                      <span className="text-sm font-semibold text-text-main flex-1 truncate group-hover:text-primary transition-colors">
                        {task.title}
                      </span>
                      {task.priority && (
                        <span className="text-[10px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">
                          High
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

