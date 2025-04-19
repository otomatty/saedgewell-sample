'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../../shadcn/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../shadcn/drawer';
import { cn } from '../../lib/utils';

interface ResponsiveDialogProps {
  children:
    | React.ReactNode
    | ((props: { close: () => void }) => React.ReactNode);
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  contentClassName?: string;
  onSuccess?: () => void;
}

export function ResponsiveDialog({
  children,
  trigger,
  title,
  description,
  className,
  contentClassName,
  onSuccess,
}: ResponsiveDialogProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const dialogRef = useRef<HTMLDivElement>(null);

  const closeDialog = useCallback(() => {
    setOpen(false);
    onSuccess?.();
  }, [onSuccess]);

  // DialogContentのaria-describedby警告を解消
  const dialogContentProps = {
    className: cn('sm:max-w-[425px]', contentClassName),
    'aria-describedby': description ? 'dialog-description' : undefined,
    ref: dialogRef,
  };

  const renderChildren = () => {
    if (typeof children === 'function') {
      return children({ close: closeDialog });
    }
    return children;
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          {(title || description) && (
            <DrawerHeader className="text-left">
              {title && <DrawerTitle>{title}</DrawerTitle>}
              {description && (
                <DrawerDescription>{description}</DrawerDescription>
              )}
            </DrawerHeader>
          )}
          <div className={cn('px-4', className)}>{renderChildren()}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent {...dialogContentProps}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription id="dialog-description">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className={className}>{renderChildren()}</div>
      </DialogContent>
    </Dialog>
  );
}
