import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const TeamPage: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-background-light p-8 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Team Detail</h2>
            <p className="text-text-secondary mt-2 max-w-2xl text-base leading-relaxed">
              Monitor team availability, skill distribution, and workload capacity.
            </p>
          </div>
          <Button>
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Add Member
          </Button>
        </div>
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
  );
};

