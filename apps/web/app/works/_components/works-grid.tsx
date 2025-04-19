import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@kit/ui/badge';
import { Card, CardContent, CardFooter } from '@kit/ui/card';
import type { Database } from '~/lib/database.types';

type Work = Database['public']['Tables']['works']['Row'] & {
  work_technologies: {
    technologies: Database['public']['Tables']['technologies']['Row'];
  }[];
};

interface WorksGridProps {
  works: Work[];
}

export function WorksGrid({ works }: WorksGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {works.map((work) => (
        <Link key={work.id} href={`/works/${work.slug}`}>
          <Card className="group h-full overflow-hidden transition-all hover:border-primary">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={work.thumbnail_url}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold">{work.title}</h3>
              <p className="mt-2 line-clamp-2 text-muted-foreground">
                {work.description}
              </p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 border-t p-6">
              {work.work_technologies.map(({ technologies }) => (
                <Badge key={technologies.id} variant="secondary">
                  {technologies.name}
                </Badge>
              ))}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
