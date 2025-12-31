import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const TeamPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-background-light overflow-hidden">
      <div className="px-8 py-6 bg-surface-light border-b border-border-color flex justify-end items-center shrink-0">
        <Button>
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Add Member
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-12">
          <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">Team management will be implemented here</p>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

