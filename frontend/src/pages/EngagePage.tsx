import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { tasksAPI } from '@/lib/api';
import { useFloatingText, FloatingText } from '@/components/features/FloatingText';

export const EngagePage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, updateTask } = useApp();
  const [timeFilter, setTimeFilter] = useState<string>('All');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const { texts, addFloatingText } = useFloatingText();

  const filteredTasks = tasks
    .filter(t => ['organized', 'clarified', 'scheduled'].includes(t.status) && t.status !== 'completed')
    .filter(t => {
      if (timeFilter === 'All') return true;
      return t.estimatedTime === timeFilter;
    });

  const activeTask = selectedTaskId
    ? tasks.find(t => t.id === selectedTaskId)
    : (filteredTasks.length > 0 ? filteredTasks[0] : null);

  const handleCheckSubtask = async (subtaskId: number) => {
    if (!activeTask) return;
    const updatedSubtasks = (activeTask.subtasks || []).map(s => {
      if (s.id === subtaskId) {
        const isDone = !s.done;
        if (isDone) {
          addFloatingText('+10 XP', 'text-yellow-600');
        }
        return { ...s, done: isDone };
      }
      return s;
    });

    const doneCount = updatedSubtasks.filter(s => s.done).length;
    const total = updatedSubtasks.length;
    const progressVal = total === 0 ? 0 : Math.round((doneCount / total) * 100);

    await updateTask(activeTask.id, {
      subtasks: updatedSubtasks,
      progress: progressVal,
    });
  };

  const handleCompleteTask = async () => {
    if (activeTask) {
      addFloatingText('Completed!', 'text-green-600 font-bold text-xl');
      await tasksAPI.complete(activeTask.id);
      await updateTask(activeTask.id, { status: 'completed' });
      setSelectedTaskId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light overflow-hidden relative">
      {/* Floating Texts Layer */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {texts.map(ft => (
          <FloatingText
            key={ft.id}
            text={ft.text}
            color={ft.color}
          />
        ))}
      </div>

      <div className="px-6 py-6 border-b border-border-color bg-surface-light shrink-0">
        <h1 className="text-2xl font-bold text-text-main mb-4">What's the plan?</h1>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['All', '15m', '30m', '1h', '2h+'].map(tf => (
            <Button
              key={tf}
              onClick={() => {
                setTimeFilter(tf);
                setSelectedTaskId(null);
              }}
              variant={timeFilter === tf ? 'default' : 'outline'}
              size="sm"
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-80 lg:w-96 border-r border-border-color bg-white overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p>No tasks match this filter.</p>
            </div>
          ) : (
            <div>
              <div className="px-4 py-3 bg-slate-50 border-b border-border-color text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0">
                Available Tasks ({filteredTasks.length})
              </div>
              {filteredTasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTaskId(t.id)}
                  className={`p-4 border-b border-border-color cursor-pointer transition-colors hover:bg-slate-50 ${
                    activeTask && activeTask.id === t.id
                      ? 'bg-blue-50/50 border-l-4 border-l-primary'
                      : 'border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4
                      className={`font-bold text-sm leading-tight ${
                        activeTask && activeTask.id === t.id ? 'text-primary' : 'text-slate-700'
                      }`}
                    >
                      {t.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                      {t.estimatedTime || 'N/A'}
                    </span>
                    {t.difficulty && (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                        {t.difficulty}
                      </span>
                    )}
                    {t.progress && t.progress > 0 && (
                      <span className="text-[10px] font-bold text-green-600">{t.progress}% done</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 bg-slate-50/50 p-4 md:p-8 overflow-y-auto flex flex-col items-center">
          {activeTask ? (
            <Card className="max-w-3xl w-full animate-fade-in-up">
              <CardHeader className="p-6 md:p-8 border-b border-border-color">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                    Active Mission
                  </span>
                  {activeTask.estimatedTime && (
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                      {activeTask.estimatedTime}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">{activeTask.title}</h2>
                <p className="text-slate-500">Break it down and execute.</p>
              </CardHeader>

              <CardContent className="p-6 md:p-8 bg-slate-50/30 min-h-[300px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Subtasks & Steps</h3>
                  <span className="text-xs font-bold text-slate-400">{activeTask.progress || 0}% Complete</span>
                </div>

                <div className="flex flex-col gap-3">
                  {activeTask.subtasks && activeTask.subtasks.length > 0 ? (
                    activeTask.subtasks.map(s => (
                      <div
                        key={s.id}
                        onClick={() => handleCheckSubtask(s.id)}
                        className={`group flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                          s.done
                            ? 'bg-slate-50 border-slate-200 opacity-60'
                            : 'bg-white border-slate-200 hover:border-primary hover:shadow-md'
                        }`}
                      >
                        <div
                          className={`size-6 rounded-lg border-2 flex items-center justify-center mr-4 transition-colors ${
                            s.done ? 'bg-primary border-primary' : 'border-slate-300 group-hover:border-primary'
                          }`}
                        >
                          {s.done && <span className="material-symbols-outlined text-white text-sm">check</span>}
                        </div>
                        <span
                          className={`flex-1 font-medium ${
                            s.done ? 'text-slate-500 line-through' : 'text-slate-700'
                          }`}
                        >
                          {s.text}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400 italic">
                      No subtasks defined. <br />
                      <Button
                        variant="link"
                        onClick={() => navigate(`/clarify?id=${activeTask.id}`)}
                        className="not-italic font-bold mt-2"
                      >
                        Add breakdown
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>

              <div className="p-6 md:p-8 bg-white border-t border-border-color flex justify-between items-center">
                <div className="text-sm text-slate-500">
                  Reward: <span className="font-bold text-yellow-600">+{activeTask.xpReward || 50} XP</span>
                </div>
                <Button onClick={handleCompleteTask} className="flex items-center gap-2">
                  <span className="material-symbols-outlined">check_circle</span>
                  Complete Task
                </Button>
              </div>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-6xl mb-4 text-slate-200">filter_none</span>
              <p>Select a task to engage.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

