import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { tasksAPI } from '@/lib/api';

export const TaskDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tasks, updateTask } = useApp();
  const taskId = parseInt(searchParams.get('id') || '0');
  const task = tasks.find(t => t.id === taskId);

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    }
  }, [task]);

  if (!task) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm absolute inset-0 z-50">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-slate-500">Task not found</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleComplete = async () => {
    await tasksAPI.complete(task.id);
    await updateTask(task.id, { status: 'completed' });
    navigate('/');
  };

  const handleSave = async () => {
    await updateTask(task.id, {
      title,
      description,
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm absolute inset-0 z-50">
      <div className="relative w-full max-w-[1200px] h-[90vh] flex flex-col bg-surface-light rounded-xl shadow-2xl border border-border-color overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-color bg-surface-light">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <span className="material-symbols-outlined text-primary">deployed_code</span>
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">Coreterra</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => navigate('/organize')}>
              <span className="material-symbols-outlined">close</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          <div className="flex-1 overflow-y-auto p-6 lg:p-10">
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-400 mb-2">Task Title</label>
              <Input
                className="w-full bg-transparent border-none text-3xl lg:text-4xl font-bold text-slate-900 placeholder-slate-300 focus:ring-0 p-0 leading-tight"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
              />
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                <h3 className="text-lg font-medium text-slate-800">Description</h3>
              </div>
              <Textarea
                className="bg-slate-50 rounded-xl p-4 border border-border-color min-h-[160px] cursor-text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSave}
                placeholder="Add task description..."
              />
            </div>

            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">checklist</span>
                  <h3 className="text-lg font-medium text-slate-800">Subtasks</h3>
                </div>
                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div
                        className={`size-5 rounded border-2 flex items-center justify-center ${
                          subtask.done
                            ? 'bg-primary border-primary'
                            : 'border-slate-300'
                        }`}
                      >
                        {subtask.done && (
                          <span className="material-symbols-outlined text-white text-sm">check</span>
                        )}
                      </div>
                      <span
                        className={`flex-1 ${subtask.done ? 'text-slate-500 line-through' : 'text-slate-700'}`}
                      >
                        {subtask.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[360px] bg-slate-50 border-l border-border-color p-6 flex flex-col gap-6 overflow-y-auto">
            <Button
              onClick={handleComplete}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/30 transform active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">check_circle</span>
              <span>Mark Complete</span>
            </Button>

            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1 rounded-xl p-4 border border-border-color bg-white relative overflow-hidden">
                <p className="text-slate-500 text-xs font-medium uppercase">XP Reward</p>
                <p className="text-slate-900 tracking-tight text-2xl font-bold">
                  +{task.xpReward || 50} XP
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Task Info
                </p>
                <div className="space-y-2">
                  {task.estimatedTime && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Estimated Time</span>
                      <span className="font-bold text-slate-800">{task.estimatedTime}</span>
                    </div>
                  )}
                  {task.difficulty && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Difficulty</span>
                      <span className="font-bold text-slate-800">{task.difficulty}</span>
                    </div>
                  )}
                  {task.status && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Status</span>
                      <span className="font-bold text-slate-800 capitalize">{task.status}</span>
                    </div>
                  )}
                  {task.progress !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-bold text-slate-800">{task.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

