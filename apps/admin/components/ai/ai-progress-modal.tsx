'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@kit/ui/dialog';
import { Button } from '@kit/ui/button';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

export interface AiProgressStep {
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface AiProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: AiProgressStep[];
  error?: string | null;
  onCancel?: () => void; // キャンセル処理用コールバック
}

export function AiProgressModal({
  isOpen,
  onClose,
  title,
  steps,
  error,
  onCancel,
}: AiProgressModalProps) {
  const isProcessing = steps.some((step) => step.status === 'processing');
  const isCompleted = steps.every((step) => step.status === 'completed');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-2">
              {step.status === 'pending' && (
                <div className="h-4 w-4 rounded-full border border-muted-foreground" />
              )}
              {step.status === 'processing' && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
              {step.status === 'completed' && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              {step.status === 'error' && (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span
                className={`text-sm ${
                  step.status === 'error'
                    ? 'text-red-600'
                    : step.status === 'completed'
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive">
              <p className="font-medium">エラーが発生しました:</p>
              <p>{error}</p>
            </div>
          )}
          {isCompleted && !error && (
            <div className="mt-4 p-3 bg-green-600/10 border border-green-600/30 rounded-md text-sm text-green-700">
              <p className="font-medium">処理が完了しました！</p>
            </div>
          )}
        </div>
        <DialogFooter>
          {isProcessing && onCancel && (
            <Button variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
          )}
          {(!isProcessing || error) && (
            <Button onClick={onClose}>閉じる</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
