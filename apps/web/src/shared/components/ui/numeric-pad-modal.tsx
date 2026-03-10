import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Delete, Check } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/shared/lib/utils';

interface NumericPadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: number) => void;
  initialValue?: number;
  title?: string;
  allowDecimals?: boolean;
  max?: number;
}

export function NumericPadModal({
  isOpen,
  onClose,
  onConfirm,
  initialValue = 0,
  title = 'Ingresar valor',
  allowDecimals = false,
  max,
}: NumericPadModalProps) {
  const [valueStr, setValueStr] = useState(initialValue === 0 ? '' : String(initialValue));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setValueStr(initialValue === 0 ? '' : String(initialValue));
    }
  }, [isOpen, initialValue]);

  if (!mounted || !isOpen) return null;

  const handleKeyPress = (key: string) => {
    setValueStr((prev) => {
      let next = prev;

      if (key === '.' && !allowDecimals) return prev;
      if (key === '.' && prev.includes('.')) return prev;

      if (prev === '0' && key !== '.') {
        next = key;
      } else {
        next = prev + key;
      }

      // Check max limit
      if (max !== undefined) {
        const numVal = Number(next);
        if (!isNaN(numVal) && numVal > max) {
          return String(max);
        }
      }

      return next;
    });
  };

  const handleBackspace = () => {
    setValueStr((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    const numValue = Number(valueStr);
    onConfirm(isNaN(numValue) ? 0 : numValue);
    onClose();
  };

  const displayValue = valueStr || '0';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:items-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] bg-background/80 p-6 shadow-2xl backdrop-blur-xl border border-white/20 dark:border-white/10 sm:mb-8 animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{title}</h3>
          <div className="mt-2 text-5xl font-light tracking-tight text-foreground h-16 flex items-center justify-center overflow-hidden">
            {displayValue}
          </div>
        </div>

        {/* Numpad Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(String(num))}
              className="flex h-16 items-center justify-center rounded-2xl bg-secondary/50 text-2xl font-normal transition-all hover:bg-secondary active:scale-95 text-foreground"
            >
              {num}
            </button>
          ))}
          
          <button
            onClick={() => handleKeyPress('.')}
            disabled={!allowDecimals}
            className={cn(
              "flex h-16 items-center justify-center rounded-2xl bg-secondary/30 text-2xl font-normal transition-all text-foreground",
              allowDecimals ? "hover:bg-secondary active:scale-95" : "opacity-30 cursor-not-allowed"
            )}
          >
            {allowDecimals ? '.' : ''}
          </button>
          
          <button
            onClick={() => handleKeyPress('0')}
            className="flex h-16 items-center justify-center rounded-2xl bg-secondary/50 text-2xl font-normal transition-all hover:bg-secondary active:scale-95 text-foreground"
          >
            0
          </button>
          
          <button
            onClick={handleBackspace}
            className="flex h-16 items-center justify-center rounded-2xl bg-secondary/30 text-xl font-normal transition-all hover:bg-secondary active:scale-95 text-foreground"
          >
            <Delete className="h-6 w-6 stroke-[1.5]" />
          </button>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <Button 
            onClick={handleConfirm}
            className="w-full h-14 rounded-2xl text-lg font-medium shadow-lg hover:shadow-primary/25 active:scale-[0.98] transition-all"
          >
            Confirmar <Check className="ml-2 h-5 w-5" />
          </Button>
        </div>

      </div>
    </div>,
    document.body
  );
}
