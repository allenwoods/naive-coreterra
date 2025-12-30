import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const QuickCapturePage: React.FC = () => {
  const navigate = useNavigate();
  const { createTask } = useApp();
  const [text, setText] = useState('');

  const handleSave = async () => {
    if (text.trim()) {
      await createTask({
        title: text.trim(),
        status: 'inbox',
        priority: false,
      });
      navigate('/inbox');
    }
  };

  return (
    <div className="flex-1 h-full w-full bg-background-light relative z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 z-0 bg-slate-900/20 backdrop-blur-sm"
        onClick={() => navigate('/')}
      />
      <Card className="w-full max-w-[800px] flex flex-col rounded-2xl shadow-2xl shadow-blue-900/10 ring-1 ring-black/5 overflow-hidden animate-fade-in-up z-10">
        <CardHeader className="px-6 pt-6 pb-2 flex justify-between items-center">
          <div className="flex items-center gap-2 text-text-secondary select-none">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
            <span className="text-sm font-bold tracking-wide uppercase text-primary/90">Quick Capture</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>close</span>
          </Button>
        </CardHeader>
        <CardContent className="px-6 py-3 flex-1">
          <Textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                handleSave();
              }
            }}
            className="w-full bg-transparent border-none p-0 text-2xl md:text-3xl font-medium text-text-main placeholder:text-slate-300 focus:ring-0 resize-none h-40 md:h-52 leading-relaxed"
            placeholder="Drop anything in your mind....."
          />
        </CardContent>
        <div className="bg-surface-alt px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border-color">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="flex items-center gap-2.5 text-text-secondary bg-white px-3 py-1.5 rounded-md border border-border-color shadow-sm">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>mail</span>
              <p className="text-sm font-medium">
                Inbox: <span className="text-text-main font-bold">4 pending</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 w-full md:w-auto justify-end">
            <p className="hidden md:block text-xs text-slate-400 font-semibold mr-1">
              Press <span className="border border-slate-300 bg-white rounded px-1.5 py-0.5 mx-1 font-sans text-slate-600 shadow-sm text-[10px]">↵</span> to save
            </p>
            <Button onClick={handleSave} className="flex min-w-[84px] items-center justify-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>keyboard_return</span>
              <span className="truncate">Save to Inbox</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

