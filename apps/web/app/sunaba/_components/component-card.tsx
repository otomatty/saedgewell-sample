'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import type { ComponentDoc } from '../types';

export function ComponentCard({
  component,
  isGridView,
}: {
  component: ComponentDoc;
  isGridView: boolean;
}) {
  return (
    <Link
      href={`/sunaba/${component.category}/${component.id}`}
      className="block transition-transform hover:scale-105"
    >
      <Card className={`overflow-hidden ${isGridView ? '' : 'flex'}`}>
        <div className="flex-1">
          <CardHeader>
            <CardTitle className="text-xl">{component.name}</CardTitle>
            <CardDescription>{component.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {component.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">使い方</h3>
              <p className="text-sm text-muted-foreground">
                {component.usage.description}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">実装の特徴</h3>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                {component.implementation.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
