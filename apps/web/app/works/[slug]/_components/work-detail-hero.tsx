'use client';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import type { Database } from '~/lib/database.types';

type Technology = Database['public']['Tables']['technologies']['Row'];

interface WorkDetailHeroProps {
  title: string;
  description: string;
  technologies: Technology[];
  githubUrl: string | null;
  websiteUrl: string | null;
}

export function WorkDetailHero({
  title,
  description,
  technologies,
  githubUrl,
  websiteUrl,
}: WorkDetailHeroProps) {
  return (
    <section className="bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container py-20">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {title}
              </h1>
              <p className="text-lg text-muted-foreground">{description}</p>
            </div>
            <div className="flex gap-2">
              {githubUrl && (
                <Button variant="outline" size="icon" asChild>
                  <Link
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHubを見る</span>
                  </Link>
                </Button>
              )}
              {websiteUrl && (
                <Button variant="outline" size="icon" asChild>
                  <Link
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span className="sr-only">Webサイトを見る</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {technologies
              ?.filter((tech) => tech !== null)
              .map((tech) => (
                <Badge key={tech.id} variant="secondary">
                  {tech.name}
                </Badge>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
