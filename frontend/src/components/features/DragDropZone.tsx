import React from 'react';
import { cn } from '@/lib/utils';

interface DragDropZoneProps {
  id: string;
  onDrop: (item: any) => void;
  isOver?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const DragDropZone: React.FC<DragDropZoneProps> = ({
  id,
  onDrop,
  isOver = false,
  className,
  children,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('application/json'));
    onDrop(item);
  };

  return (
    <div
      id={id}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'transition-all',
        isOver && 'border-primary border-2 bg-primary/5',
        className
      )}
    >
      {children}
    </div>
  );
};

