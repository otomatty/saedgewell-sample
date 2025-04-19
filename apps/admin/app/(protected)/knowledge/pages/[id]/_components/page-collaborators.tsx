'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@kit/ui/avatar';
import { Badge } from '@kit/ui/badge';

interface Collaborator {
  name: string;
  display_name: string;
  photo_url: string | null;
  is_last_editor: boolean;
}

interface PageCollaboratorsProps {
  collaborators: Collaborator[];
}

export function PageCollaborators({ collaborators }: PageCollaboratorsProps) {
  return (
    <div className="space-y-4">
      {collaborators.map((collaborator) => (
        <div
          key={collaborator.name}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={collaborator.photo_url ?? undefined} />
              <AvatarFallback>
                {collaborator.display_name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{collaborator.display_name}</div>
              <div className="text-sm text-muted-foreground">
                {collaborator.name}
              </div>
            </div>
          </div>
          {collaborator.is_last_editor && <Badge>最終編集者</Badge>}
        </div>
      ))}

      {collaborators.length === 0 && (
        <div className="text-sm text-muted-foreground">
          編集者情報はありません
        </div>
      )}
    </div>
  );
}
