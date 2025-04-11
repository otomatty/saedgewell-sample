'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@kit/ui/popover';
import { Button } from '@kit/ui/button';
import { Bot, Github, Lightbulb, Sparkles, FileText } from 'lucide-react';

export type AiActionType =
  | 'github'
  | 'title'
  | 'suggestion'
  | 'challenge_solution';

interface AiFabMenuProps {
  onActionSelect: (action: AiActionType) => void;
  disabled?: boolean;
}

export function AiFabMenu({ onActionSelect, disabled }: AiFabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (action: AiActionType) => {
    setIsOpen(false);
    onActionSelect(action);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-lg w-14 h-14 z-50"
          disabled={disabled}
          aria-label="AI機能メニューを開く"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 mb-2 mr-4" side="top" align="end">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSelect('github')}
            className="justify-start"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHubから生成
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSelect('title')}
            className="justify-start"
          >
            <FileText className="mr-2 h-4 w-4" />
            タイトルから生成
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSelect('suggestion')}
            className="justify-start"
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            改善提案
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSelect('challenge_solution')}
            className="justify-start"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            課題/解決策提案
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
