import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingTextProps {
  text: string;
  color?: string;
  onComplete?: () => void;
}

export const FloatingText: React.FC<FloatingTextProps> = ({ 
  text, 
  color = 'text-yellow-600',
  onComplete 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'animate-float-up text-lg font-bold pointer-events-none z-50',
        color
      )}
    >
      {text}
    </div>
  );
};

interface FloatingTextManagerProps {
  children: React.ReactNode;
}

export const FloatingTextManager: React.FC<FloatingTextManagerProps> = ({ children }) => {
  const [texts, setTexts] = useState<Array<{ id: number; text: string; color: string }>>([]);

  const addFloatingText = (text: string, color: string = 'text-yellow-600') => {
    const id = Date.now();
    setTexts(prev => [...prev, { id, text, color }]);
  };

  const removeText = (id: number) => {
    setTexts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="relative w-full h-full">
      {children}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {texts.map(ft => (
          <FloatingText
            key={ft.id}
            text={ft.text}
            color={ft.color}
            onComplete={() => removeText(ft.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Hook for using floating text
export const useFloatingText = () => {
  const [texts, setTexts] = useState<Array<{ id: number; text: string; color: string }>>([]);

  const addFloatingText = (text: string, color: string = 'text-yellow-600') => {
    const id = Date.now() + Math.random();
    setTexts(prev => [...prev, { id, text, color }]);
    
    setTimeout(() => {
      setTexts(prev => prev.filter(t => t.id !== id));
    }, 1000);
  };

  return { texts, addFloatingText };
};

