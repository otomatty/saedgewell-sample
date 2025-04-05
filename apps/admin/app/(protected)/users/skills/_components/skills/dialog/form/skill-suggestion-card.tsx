'use client';

import { Card, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import type { GeneratedSkill } from '~/lib/server/gemini/skills';

interface Props extends GeneratedSkill {
  onSelect: () => void;
}

export function SkillSuggestionCard({ name, icon_url, onSelect }: Props) {
  return (
    <Card className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        {icon_url && (
          <img
            src={icon_url}
            alt={name}
            className="h-8 w-8 rounded-full object-cover"
          />
        )}
        <CardHeader className="p-0">
          <CardTitle className="text-base">{name}</CardTitle>
        </CardHeader>
      </div>
      <Button variant="outline" onClick={onSelect}>
        選択
      </Button>
    </Card>
  );
}
