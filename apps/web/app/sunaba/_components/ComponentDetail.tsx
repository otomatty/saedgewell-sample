import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import type { ComponentDoc } from '../types';

interface ComponentDetailProps {
  component: ComponentDoc;
  category: {
    id: string;
    label: string;
  };
}

export function ComponentDetail({ component, category }: ComponentDetailProps) {
  return (
    <main className="container py-20">
      <div className="mb-8">
        <div className="mb-2">
          <a
            href={`/sunaba/${category.id}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← {category.label}に戻る
          </a>
        </div>
        <h1 className="text-4xl font-bold">{component.name}</h1>
        <p className="mt-2 text-xl text-muted-foreground">
          {component.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {component.tags.map((tag: string) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-2 py-1 text-sm text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>使い方</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {component.usage.description}
            </p>
            <div className="rounded-lg bg-secondary/50 p-4">
              <pre className="text-sm">{component.usage.example}</pre>
            </div>
            {component.usage.props.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 font-medium">Props</h3>
                <div className="space-y-2">
                  {component.usage.props.map((prop) => (
                    <div
                      key={prop.name}
                      className="rounded-lg bg-secondary/50 p-4"
                    >
                      <div className="flex items-baseline justify-between">
                        <code className="text-sm font-semibold">
                          {prop.name}
                        </code>
                        <code className="text-xs text-muted-foreground">
                          {prop.type}
                        </code>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {prop.description}
                      </p>
                      {prop.default && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          デフォルト値: {prop.default}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>実装の詳細</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {component.implementation.description}
            </p>
            <div>
              <h3 className="mb-2 font-medium">機能</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                {component.implementation.features.map((feature: string) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
