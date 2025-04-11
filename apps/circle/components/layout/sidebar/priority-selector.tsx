'use client';

import { Button } from '@kit/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@kit/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@kit/ui/popover';
import { useAtomValue } from 'jotai';
import { priorityCountsAtom } from '~/store/issues-store';
import { priorities, type Priority } from '~/mock-data/priorities';
import { CheckIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

interface PrioritySelectorProps {
  priority: Priority;
  onChange: (priority: Priority) => void;
}

export function PrioritySelector({
  priority,
  onChange,
}: PrioritySelectorProps) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(priority.id);

  // const { filterByPriority } = useIssuesStore(); // 古いフックを削除
  // TODO: Replace with priorityCountsAtom when available
  const priorityCounts = useAtomValue(priorityCountsAtom);

  useEffect(() => {
    setValue(priority.id);
  }, [priority.id]);

  const handlePriorityChange = (priorityId: string) => {
    setValue(priorityId);
    setOpen(false);

    const newPriority = priorities.find((p) => p.id === priorityId);
    if (newPriority) {
      onChange(newPriority);
    }
  };

  return (
    <div className="*:not-first:mt-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            className="flex items-center justify-center"
            size="sm"
            variant="secondary"
            aria-expanded={open}
          >
            {(() => {
              const selectedItem = priorities.find((item) => item.id === value);
              if (selectedItem) {
                const Icon = selectedItem.icon;
                return <Icon className="text-muted-foreground size-4" />;
              }
              return null;
            })()}
            <span>
              {value
                ? priorities.find((p) => p.id === value)?.name
                : 'No priority'}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Set priority..." />
            <CommandList>
              <CommandEmpty>No priority found.</CommandEmpty>
              <CommandGroup>
                {priorities.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => handlePriorityChange(item.id)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="text-muted-foreground size-4" />
                      {item.name}
                    </div>
                    {value === item.id && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                    {/* TODO: Display count using priorityCountsAtom */}
                    <span className="text-muted-foreground text-xs">
                      {priorityCounts ? (priorityCounts[item.id] ?? 0) : 0}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
