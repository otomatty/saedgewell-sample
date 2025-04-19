'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@kit/ui/card';
import type { Database } from '~/lib/database.types';

type Work = Database['public']['Tables']['works']['Row'] & {
  work_details: Database['public']['Tables']['work_details']['Row'][];
  work_images: Database['public']['Tables']['work_images']['Row'][];
  work_responsibilities: Database['public']['Tables']['work_responsibilities']['Row'][];
  work_challenges: Database['public']['Tables']['work_challenges']['Row'][];
  work_solutions: Database['public']['Tables']['work_solutions']['Row'][];
  work_results: Database['public']['Tables']['work_results']['Row'][];
  work_technologies: {
    technologies: Database['public']['Tables']['technologies']['Row'];
  }[];
};

interface WorkDetailProps {
  work: Work;
}

export function WorkDetail({ work }: WorkDetailProps) {
  const {
    work_details: [
      details = {
        overview: '',
        role: '',
        period: '',
        team_size: '',
      } as Database['public']['Tables']['work_details']['Row'],
    ],
    work_images,
    work_responsibilities,
    work_challenges,
    work_solutions,
    work_results,
  } = work;

  return (
    <div className="mx-auto max-w-4xl space-y-12">
      {/* 概要 */}
      <section>
        <h2 className="text-2xl font-bold">概要</h2>
        <p className="mt-4 text-muted-foreground">{details.overview}</p>
      </section>

      {/* 基本情報 */}
      <section>
        <h2 className="text-2xl font-bold">基本情報</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-medium">役割</dt>
            <dd className="mt-1 text-muted-foreground">{details.role}</dd>
          </div>
          <div>
            <dt className="font-medium">期間</dt>
            <dd className="mt-1 text-muted-foreground">{details.period}</dd>
          </div>
          <div>
            <dt className="font-medium">チーム規模</dt>
            <dd className="mt-1 text-muted-foreground">{details.team_size}</dd>
          </div>
        </dl>
      </section>

      {/* 担当業務 */}
      {work_responsibilities.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold">担当業務</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            {work_responsibilities.map((responsibility) => (
              <li key={responsibility.id} className="text-muted-foreground">
                {responsibility.description}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 課題と解決策 */}
      {work_challenges.length > 0 && work_solutions.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold">課題と解決策</h2>
          <div className="mt-4 grid gap-6">
            {work_challenges.map((challenge, index) => (
              <Card key={challenge.id}>
                <CardHeader>
                  <h3 className="text-xl font-semibold">
                    課題 {index + 1}: {challenge.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {challenge.description}
                  </p>
                </CardHeader>
                {work_solutions[index] && (
                  <CardContent>
                    <h4 className="font-medium">解決策:</h4>
                    <p className="mt-2 text-muted-foreground">
                      {work_solutions[index].description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 成果 */}
      {work_results.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold">成果</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            {work_results.map((result) => (
              <li key={result.id} className="text-muted-foreground">
                {result.description}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 画像ギャラリー */}
      {work_images.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold">ギャラリー</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {work_images.map((image) => (
              <div
                key={image.id}
                className="relative aspect-video overflow-hidden rounded-lg"
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
                {image.caption && (
                  <p className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-sm text-white">
                    {image.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
