import { useState, useCallback } from 'react';

interface DragState {
  isDragging: boolean;
  draggedItem: any | null;
  dragOverTarget: string | null;
}

export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    dragOverTarget: null,
  });

  const handleDragStart = useCallback((e: React.DragEvent, item: any) => {
    setDragState({
      isDragging: true,
      draggedItem: item,
      dragOverTarget: null,
    });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragState(prev => ({
      ...prev,
      dragOverTarget: targetId,
    }));
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragState(prev => ({
      ...prev,
      dragOverTarget: null,
    }));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string, onDrop: (item: any, targetId: string) => void) => {
      e.preventDefault();
      const item = dragState.draggedItem || JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (item && onDrop) {
        onDrop(item, targetId);
      }

      setDragState({
        isDragging: false,
        draggedItem: null,
        dragOverTarget: null,
      });
    },
    [dragState.draggedItem]
  );

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      dragOverTarget: null,
    });
  }, []);

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
};

