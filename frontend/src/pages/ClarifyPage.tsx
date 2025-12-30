import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Difficulty, Subtask } from '@/types';

export const ClarifyPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tasks, projects, updateTask } = useApp();
  const taskId = parseInt(searchParams.get('id') || '0');
  const task = tasks.find(t => t.id === taskId) || { title: 'New Task', id: 0 };

  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || [{ id: 1, text: '', done: false }]);
  const [difficulty, setDifficulty] = useState<Difficulty>(task.difficulty || 'Med');
  const [duration, setDuration] = useState<string>(task.estimatedTime || '1h');
  const [selectedProject, setSelectedProject] = useState<string>(task.projectId || '');

  const addSubtask = () => {
    setSubtasks([...subtasks, { id: Date.now(), text: '', done: false }]);
  };

  const getReward = () => {
    const baseXP: Record<string, number> = { '15m': 10, '30m': 20, '1h': 50, '2h+': 100 };
    const mult: Record<string, number> = { 'Easy': 1, 'Med': 2, 'Hard': 4 };
    const calculatedXP = (baseXP[duration] || 10) * (mult[difficulty] || 1);
    const calculatedGold = Math.floor(calculatedXP * 0.5);
    return { xp: calculatedXP, gold: calculatedGold };
  };

  const { xp, gold } = getReward();

  const handleClarify = async () => {
    if (taskId) {
      await updateTask(taskId, {
        difficulty,
        estimatedTime: duration,
        xpReward: xp,
        status: 'clarified',
        subtasks: subtasks.filter(s => s.text),
        projectId: selectedProject || undefined,
      });
    }
    navigate('/organize');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm absolute inset-0 z-50">
      <Card className="relative w-full max-w-[1100px] max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-fade-in-up">
        <CardHeader className="border-b border-border-color bg-white">
          <div className="flex items-center justify-between px-8 py-4">
            <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">filter_list</span>
              Clarify Task
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <span className="material-symbols-outlined">close</span>
            </Button>
          </div>
          <div className="px-8 flex gap-2 overflow-x-auto pb-4">
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider border-b-2 border-primary pb-2 px-1">
              <span className="bg-primary text-white rounded-full size-5 flex items-center justify-center text-[10px]">1</span>
              What?
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent pb-2 px-1">
              <span className="bg-slate-100 text-slate-500 rounded-full size-5 flex items-center justify-center text-[10px]">2</span>
              How?
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent pb-2 px-1">
              <span className="bg-slate-100 text-slate-500 rounded-full size-5 flex items-center justify-center text-[10px]">3</span>
              Who?
            </div>
          </div>
        </CardHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row h-full min-h-[500px]">
            <div className="flex-1 p-8 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <Label className="text-text-secondary text-xs font-bold uppercase tracking-wider pl-1">
                  Task Title (The Outcome)
                </Label>
                <Input
                  readOnly
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-medium text-slate-800"
                  value={task.title}
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-text-secondary text-xs font-bold uppercase tracking-wider pl-1 flex justify-between">
                  <span>Breakdown (How?)</span>
                  <span className="text-primary cursor-pointer hover:underline" onClick={addSubtask}>
                    + Add Step
                  </span>
                </Label>
                <div className="flex flex-col gap-2">
                  {subtasks.map((st, idx) => (
                    <div key={st.id} className="flex items-center gap-3 animate-fade-in-up">
                      <span className="material-symbols-outlined text-slate-300 text-sm">subdirectory_arrow_right</span>
                      <Input
                        className="flex-1"
                        placeholder={`Step ${idx + 1}...`}
                        defaultValue={st.text}
                        onChange={(e) => {
                          const updated = [...subtasks];
                          updated[idx].text = e.target.value;
                          setSubtasks(updated);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-secondary text-xs font-bold uppercase tracking-wider pl-1">
                  Context / Notes
                </Label>
                <Textarea
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-700 resize-y min-h-[100px] leading-relaxed shadow-sm"
                  placeholder="Add details, context, or links..."
                  defaultValue={task.description || ''}
                />
              </div>
            </div>

            <div className="w-full lg:w-[360px] bg-slate-50 p-6 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-slate-200">
              <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] p-6 rounded-2xl shadow-lg border border-blue-800/50 relative overflow-hidden text-white">
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2">Estimated Reward</div>
                  <div className="flex items-end gap-1 mb-4">
                    <span className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">+{xp}</span>
                    <span className="text-sm font-bold text-blue-300 mb-1.5">XP</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">monetization_on</span>
                    <span className="text-sm font-bold text-yellow-300">+{gold} Gold</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <Label className="text-text-secondary text-xs font-bold uppercase tracking-wider">Project</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 shadow-sm">
                      <SelectValue placeholder="Select project..." />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(p => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-text-secondary text-xs font-bold uppercase tracking-wider">Difficulty</Label>
                  <div className="flex gap-2">
                    {(['Easy', 'Med', 'Hard'] as Difficulty[]).map(level => (
                      <Button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        variant={difficulty === level ? 'default' : 'outline'}
                        className="flex-1"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-text-secondary text-xs font-bold uppercase tracking-wider">Time Estimate</Label>
                  <div className="flex w-full bg-white p-1 rounded-xl border border-slate-200">
                    {['15m', '30m', '1h', '2h+'].map(time => (
                      <Button
                        key={time}
                        onClick={() => setDuration(time)}
                        variant={duration === time ? 'default' : 'ghost'}
                        className="flex-1"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border-color bg-slate-50 p-5 flex items-center justify-between z-10">
          <Button variant="ghost" onClick={() => navigate('/')}>Save as Draft</Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/')}>Cancel</Button>
            <Button onClick={handleClarify} className="flex items-center gap-2">
              <span>Clarify & Ask XP</span>
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

