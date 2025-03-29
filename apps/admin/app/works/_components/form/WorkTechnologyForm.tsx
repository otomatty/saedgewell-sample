'use client';

import { useState } from 'react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type {
  WorkWithRelations,
  WorkTechnologyWithRelations,
} from '@kit/types/works';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@kit/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@kit/ui/popover';
import { Badge } from '@kit/ui/badge';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@kit/ui/utils';
import { toast } from 'sonner';
import { updateWorkTechnologies } from '@kit/next/actions';

const workTechnologyFormSchema = z.object({
  technologies: z.array(z.string()),
});

type WorkTechnologyFormValues = z.infer<typeof workTechnologyFormSchema>;

interface WorkTechnologyFormProps {
  work: WorkWithRelations;
}

export function WorkTechnologyForm({ work }: WorkTechnologyFormProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<WorkTechnologyFormValues>({
    resolver: zodResolver(workTechnologyFormSchema),
    defaultValues: {
      technologies: work.work_technologies.map(
        (tech: WorkTechnologyWithRelations) => tech.technology.id
      ),
    },
  });

  const onSubmit = (values: WorkTechnologyFormValues) => {
    startTransition(async () => {
      try {
        await updateWorkTechnologies(work.id, values.technologies);
        toast.success('更新完了', {
          description: '使用技術を更新しました。',
        });
        router.refresh();
      } catch (error) {
        toast.error('エラー', {
          description: '使用技術の更新に失敗しました。',
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>使用技術</FormLabel>
              <div className="space-y-4">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      技術を選択
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="技術を検索..." />
                      <CommandEmpty>技術が見つかりません。</CommandEmpty>
                      <CommandGroup>
                        {work.work_technologies.map((tech) => (
                          <CommandItem
                            key={tech.technology.id}
                            onSelect={() => {
                              const values = new Set(field.value);
                              if (values.has(tech.technology.id)) {
                                values.delete(tech.technology.id);
                              } else {
                                values.add(tech.technology.id);
                              }
                              field.onChange(Array.from(values));
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                field.value.includes(tech.technology.id)
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {tech.technology.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <div className="flex flex-wrap gap-2">
                  {field.value.map((techId) => {
                    const tech = work.work_technologies.find(
                      (t) => t.technology.id === techId
                    );
                    if (!tech) return null;
                    return (
                      <Badge
                        key={techId}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tech.technology.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => {
                            field.onChange(
                              field.value.filter((id) => id !== techId)
                            );
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <FormDescription>
                プロジェクトで使用した技術を選択してください。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? '更新中...' : '更新'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
