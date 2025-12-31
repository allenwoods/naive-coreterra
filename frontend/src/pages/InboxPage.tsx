import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

export const InboxPage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, updateTask } = useApp();
  const [mode, setMode] = useState<'list' | 'process'>('list');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const inboxItems = tasks.filter(t => t.status === 'inbox');
  const activeProcessTask = inboxItems[0];

  const handleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === inboxItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(inboxItems.map(t => t.id));
    }
  };

  const processDo = async () => {
    if (!activeProcessTask) return;
    await updateTask(activeProcessTask.id, { status: 'organized', priority: true });
    navigate('/engage');
  };

  const processDelegate = async () => {
    if (!activeProcessTask) return;
    await updateTask(activeProcessTask.id, { status: 'waiting' });
  };

  const processSchedule = async () => {
    if (!activeProcessTask) return;
    await updateTask(activeProcessTask.id, { status: 'scheduled' });
  };

  const processClarify = () => {
    if (!activeProcessTask) return;
    navigate(`/clarify?id=${activeProcessTask.id}`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light overflow-hidden">
      <div className="px-8 py-6 border-b border-border-color bg-surface-light shrink-0 flex justify-end items-center">
        <div className="flex items-center gap-3">
            {mode === 'list' && inboxItems.length > 0 && (
              <Button onClick={() => setMode('process')} className="flex items-center gap-2">
                <span className="material-icons-round text-sm">play_arrow</span>
                <span className="hidden md:inline">Start Processing</span>
              </Button>
            )}
            {mode === 'process' && (
              <Button variant="outline" onClick={() => setMode('list')} className="flex items-center gap-2">
                <span className="material-icons-round text-sm">list</span>
                <span className="hidden md:inline">List View</span>
              </Button>
            )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
        {mode === 'list' ? (
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={inboxItems.length > 0 && selectedIds.length === inboxItems.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <CardTitle className="text-sm font-bold uppercase tracking-wider">All Items</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {inboxItems.length === 0 ? (
                  <div className="p-12 flex flex-col items-center justify-center text-center text-text-secondary">
                    <span className="material-icons-round text-6xl text-slate-200 mb-4">check_circle</span>
                    <p className="text-lg font-medium">Inbox Zero!</p>
                    <p className="text-sm">You are all caught up.</p>
                  </div>
                ) : (
                  inboxItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-4 p-5 border-b border-border-color last:border-0 transition-colors ${
                        selectedIds.includes(item.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={() => handleSelect(item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => navigate(`/clarify?id=${item.id}`)}
                        >
                          <h4 className="font-semibold text-text-main text-lg">{item.title}</h4>
                          <div className="flex items-center gap-3 mt-1.5 text-sm text-text-secondary">
                            <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">
                              <span className="material-icons-round text-[14px]">schedule</span>
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/clarify?id=${item.id}`)}
                          >
                            Clarify
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto h-full flex flex-col justify-center items-center -mt-10">
            {activeProcessTask ? (
              <div className="w-full animate-fade-in-up">
                <div className="text-center mb-6">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Processing {inboxItems.length} items
                  </span>
                </div>

                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${(1 / inboxItems.length) * 100}%` }}
                    />
                  </div>
                  <CardContent className="p-8 md:p-12 flex flex-col gap-8 text-center">
                    <div className="flex flex-col gap-4">
                      <div className="text-text-secondary font-bold text-sm uppercase tracking-wider">Inbox Item</div>
                      <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-800 leading-tight">
                        {activeProcessTask.title}
                      </h2>
                      <p className="text-slate-400 text-sm">
                        Captured {activeProcessTask.createdAt ? new Date(activeProcessTask.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Button onClick={processDo} className="group flex flex-col items-center justify-center gap-3 p-6 h-auto">
                        <div className="size-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-2xl">bolt</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Do It Now</div>
                          <div className="text-xs text-slate-500 mt-1">&lt; 2 Minutes</div>
                        </div>
                      </Button>

                      <Button onClick={processDelegate} variant="outline" className="group flex flex-col items-center justify-center gap-3 p-6 h-auto">
                        <div className="size-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-2xl">group</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Delegate</div>
                          <div className="text-xs text-slate-500 mt-1">Waiting For...</div>
                        </div>
                      </Button>

                      <Button onClick={processSchedule} variant="outline" className="group flex flex-col items-center justify-center gap-3 p-6 h-auto">
                        <div className="size-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-2xl">calendar_month</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Schedule</div>
                          <div className="text-xs text-slate-500 mt-1">Defer date</div>
                        </div>
                      </Button>

                      <Button onClick={processClarify} variant="outline" className="group flex flex-col items-center justify-center gap-3 p-6 h-auto">
                        <div className="size-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-2xl">filter_list</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Clarify</div>
                          <div className="text-xs text-slate-500 mt-1">Breakdown & Plan</div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center animate-fade-in-up">
                <div className="size-24 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-5xl">check</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">All Clear!</h2>
                <p className="text-slate-500 mb-8">You've processed all items in your inbox.</p>
                <Button onClick={() => setMode('list')}>Return to Overview</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

