'use client';

import type { Project } from '@kit/types';
import { ProjectCard } from './project-card';

interface ProjectListClientProps {
  projects: Project[];
}

export function ProjectListClient({ projects }: ProjectListClientProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          プロジェクトがありません。新しいプロジェクトを作成してください。
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          name={project.name}
          description={project.description}
          emoji={project.emoji}
        />
      ))}
    </div>
  );
}
