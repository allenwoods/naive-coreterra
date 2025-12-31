import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const NotificationPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-background-light overflow-hidden">
      <div className="px-8 py-6 bg-surface-light border-b border-border-color flex justify-end items-center shrink-0">
        <Button variant="ghost">Mark all as read</Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-500">No notifications</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

